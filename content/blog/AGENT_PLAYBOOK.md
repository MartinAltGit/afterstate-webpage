# Agent playbook — Fashion Blog auto-publish

**Cadence:** **2 posts per week** (Mon + Thu) · **Approval:** none · **Target:** Shopify blog handle `blog`  
**Images:** Magnific only (Nano Banana 2 or Freepik stock) · **Never** scrape random fashion sites

Follow this playbook end-to-end in one run. Publish live. Do not wait for human approval.

**Storefront (locked):** every article uses the same templates. `/blog` stacks full-bleed covers **newest on top**. `/blog/:handle` is the night hero + reading column + look-ad rail. Do not change those layouts when publishing. Hub structure belongs in the article HTML (`voice.md` + `clusters.md`), not a new template.

---

## 0. Preconditions

- Repo checkout with `content/blog/` and `scripts/blog-automation/`
- Env (Cursor Secrets — **do not abort if `SHOPIFY_ADMIN_TOKEN` is missing**):
  - `SHOPIFY_SHOP` (e.g. `rirapf-tf.myshopify.com`)
  - **`SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET`** (Dev Dashboard app with `read_content,write_content`)
  - Optional: `SHOPIFY_BLOG_ID`, or a legacy `shpat_` `SHOPIFY_ADMIN_TOKEN`
- Magnific MCP available
- OpenSEO MCP available (keyword check)
- Fashion blog with handle `blog` exists in Shopify Admin

Verify auth before drafting:

```bash
node scripts/blog-automation/resolve-blog-id.mjs
```

If that command fails, stop. Do **not** require `SHOPIFY_ADMIN_TOKEN`.

Then sync the calendar against live Shopify articles (stale checkouts retry already-live posts otherwise):

```bash
node scripts/blog-automation/sync-calendar.mjs
```

If that command marks a topic published, **do not end the run**. Pick the next remaining queued topic and publish a **new** article.

---

## 1. Pick (and refill) the calendar

1. Open `content/blog/calendar.json` **after** `sync-calendar.mjs`.
2. Count topics with `"status": "queued"`.
3. If fewer than `minQueuedBeforeRefill`, append `refillCount` new topics (~2 weeks):
   - Follow `categories.md` rotation, `clusters.md` (prefer spokes under open clusters), and `KEYWORD_MAP.md` / OpenSEO metrics
   - Set `role`, `cluster`, and `hubHandle` (spokes only)
   - Assign `imageMode`: `generate` for trends/seasonal/craft; `stock` for street_style/culture
   - Set a stable `handle` (pillars especially — spokes link to it)
   - Leave `publishedAt` null; `status: "queued"`
4. Select the **oldest** queued topic (first matching in array order with `status: "queued"`). Skip any whose handle already exists on Shopify.
5. Skip if category matches the most recent `published` category and another queued category exists — pick the next suitable queued item.
6. **Cadence guard:** publish **one new** Shopify article per run. If the first queued topic was already live, mark it published and continue with the next queued topic. Never publish two **new** posts in one run. Never finish after only syncing a duplicate.

---

## 2. Research (light)

- 5–10 minutes of context: current seasonal cues, silhouette language, fabric talk — enough to be accurate, not a news wire dump
- Prefer evergreen framing over ephemeral gossip
- Do **not** invent fake quotes, fake “experts”, or fake statistics

---

## 3. Draft the article

Follow `voice.md` **and** `clusters.md`. Use the calendar topic’s `role` (`pillar` | `spoke` | `standard`) and `cluster`.

| Output | Notes |
| --- | --- |
| `title` | From calendar or lightly improved |
| `handle` | From calendar if set (pillars should be stable); otherwise kebab-case from title; unique vs published handles |
| `summary` | 140–160 chars |
| `seoTitle` | ≤ ~60 chars |
| `seoDescription` | ≤ ~155 chars |
| `tags` | From calendar + category (do **not** add `cluster-*` / `role-*` by hand — `publish.mjs` adds them) |
| `cluster` | From calendar (`quiet-luxury`, `fabric`, …) |
| `role` | From calendar (`pillar` or `spoke`) |
| `bodyHtml` | Pillar 1200–1800 words **or** spoke/standard 800–1200; HTML skeleton from `voice.md` |
| `imageAlt` | Descriptive, keyword-aware |

**Pillar:** `blog-answer` at the top, `blog-takeaways`, 5–8 H2s with short answers, `blog-deeper` to live spokes, `blog-faq`. No TOC in the HTML.  
**Spoke:** `blog-answer`, link to `/blog/{hubHandle}`, `blog-faq`, closing `blog-deeper` back to the pillar.  
**Do not invent spoke URLs** — only link handles that are `published` or this run’s topic.

Write the payload to a temp file for the publisher, e.g. `content/blog/.last-draft.json` (gitignored pattern via `content/blog/.draft-*` if needed — prefer stdin/CLI args via publish script).

---

## 4. Image

### 4a. `imageMode: "generate"` — Nano Banana 2

1. `simulate_cost` for `images_generate` with:
   - `mode`: `imagen-nano-banana-2-flash`
   - `aspectRatio`: `3:2` (or `16:9`)
   - `prompt`: editorial fashion hero matching the article (see `voice.md`)
   - `count`: 1
2. `images_generate` with the same args
3. `creations_show` with returned identifier(s)
4. `creations_wait` until ready; take the **final asset URL** for Shopify `image.url`

### 4b. `imageMode: "stock"` — Freepik via Magnific

1. `stock_search` with `content_type: "photo"`, prefer `license: "free"`, query from topic keywords
2. Pick a strong editorial photo (clothing / city / fabric — not logos)
3. `stock_download` for a signed URL (or `stock_to_creation` + wait if a durable creation URL is needed)
4. Use that URL as Shopify `image.url`; set sensible `altText`

**Never** hotlink copyrighted runway galleries or random scraped CDNs.

---

## 5. Publish to Shopify

```bash
node scripts/blog-automation/publish.mjs --file path/to/draft.json
```

Draft JSON shape:

```json
{
  "title": "...",
  "handle": "...",
  "body": "<p>...</p>",
  "summary": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "tags": ["trends", "street style"],
  "cluster": "quiet-luxury",
  "role": "spoke",
  "imageUrl": "https://...",
  "imageAlt": "...",
  "authorName": "Afterstate",
  "isPublished": true
}
```

Expect `isPublished: true`. On success, note returned article `id` + `handle`.  
If the script returns `alreadyExists: true`, mark that topic published, then go back to step 1 and publish the **next** queued topic (still one new article this run). Do not stop after only recovering a duplicate.

---

## 6. Mark calendar published

Update the topic in `content/blog/calendar.json`:

```bash
node scripts/blog-automation/mark-published.mjs --id <topicId> --handle <handle> --article-id gid://shopify/Article/...
```

Then **commit and push** `content/blog/calendar.json` on the same branch the automation checked out (`main`). If this environment cannot push to `main`, open a PR and say so in the report. The next run still starts with `sync-calendar.mjs`, so a missed calendar push must not retry a live handle.

---

## 7. Report

Short summary only:

- Title + `/blog/{handle}`
- Category + image mode
- Any warnings (cache lag, stock license, duplicate-handle recovery, etc.)

---

## Failure rules

- If Magnific fails: retry once; if still failing, switch `generate` ↔ `stock` once; if still failing, **stop** (do not publish without an image)
- If Shopify `userErrors`: fix payload and retry once; then stop
- Never publish to blog handle `journal`
- Never invent fake news events as “breaking”
- Never stop solely because `SHOPIFY_ADMIN_TOKEN` is unset
- Never end a run after only syncing or recovering an already-live handle unless no queued topics remain
