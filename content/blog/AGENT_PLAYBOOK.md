# Agent playbook — Fashion Blog auto-publish

**Cadence:** **2 posts per week** (Mon + Thu) · **Approval:** none · **Target:** Shopify blog handle `blog`  
**Images:** Magnific only (Nano Banana 2 or Freepik stock) · **Never** scrape random fashion sites

Follow this playbook end-to-end in one run. Publish live. Do not wait for human approval.

**Storefront (locked):** every article uses the same templates. `/blog` stacks full-bleed covers **newest on top**. `/blog/:handle` is the night hero + reading column + look-ad rail. Do not change those layouts when publishing.

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

---

## 1. Pick (and refill) the calendar

1. Open `content/blog/calendar.json`.
2. Count topics with `"status": "queued"`.
3. If fewer than `minQueuedBeforeRefill`, append `refillCount` new topics (~2 weeks):
   - Follow `categories.md` rotation and `KEYWORD_MAP.md` / OpenSEO metrics
   - Assign `imageMode`: `generate` for trends/seasonal/craft; `stock` for street_style/culture
   - Leave `handle` / `publishedAt` null; `status: "queued"`
4. Select the **oldest** queued topic (first matching in array order with `status: "queued"`).
5. Skip if category matches the most recent `published` category and another queued category exists — pick the next suitable queued item.
6. **Cadence guard:** scheduled runs publish **one** post. Manual **Run** after a missed/rate-limited slot should still publish that one queued topic. Never publish two posts in one run.

---

## 2. Research (light)

- 5–10 minutes of context: current seasonal cues, silhouette language, fabric talk — enough to be accurate, not a news wire dump
- Prefer evergreen framing over ephemeral gossip
- Do **not** invent fake quotes, fake “experts”, or fake statistics

---

## 3. Draft the article

Follow `voice.md`. Produce:

| Output | Notes |
| --- | --- |
| `title` | From calendar or lightly improved |
| `handle` | kebab-case from title; unique vs published handles |
| `summary` | 140–160 chars |
| `seoTitle` | ≤ ~60 chars |
| `seoDescription` | ≤ ~155 chars |
| `tags` | From calendar + category |
| `bodyHtml` | 800–1200 words, HTML skeleton from `voice.md` |
| `imageAlt` | Descriptive, keyword-aware |

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
  "imageUrl": "https://...",
  "imageAlt": "...",
  "authorName": "Afterstate",
  "isPublished": true
}
```

Expect `isPublished: true`. On success, note returned article `id` + `handle`.  
If the script returns `alreadyExists: true`, treat that as success (do not create a second article) and continue to mark the calendar.

---

## 6. Mark calendar published

Update the topic in `content/blog/calendar.json`:

```bash
node scripts/blog-automation/mark-published.mjs --id <topicId> --handle <handle> --article-id gid://shopify/Article/...
```

Then **commit and push** `content/blog/calendar.json` on the same branch the automation checked out (`main`). Without this push, the next run will try the same queued topic again.

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
