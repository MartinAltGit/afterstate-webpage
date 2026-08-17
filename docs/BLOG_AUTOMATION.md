# Fashion Blog automation

Auto-publishes SEO fashion posts to Shopify blog handle **`blog`** **twice per week** (Monday + Thursday). No approval gate — edit or unpublish in Admin if something is wrong.

Storefront: `/blog` stacks every article as a full-bleed cover, **newest on top** → `/blog/:handle` is the night article page (hero, reading column, look-ad rail). Same templates for every post. Journal stays separate.

Articles are a **hub-and-spoke** system: one pillar per cluster, spokes for long-tail keywords. Structure lives in the HTML (`blog-answer`, `blog-takeaways`, `blog-deeper`, `blog-faq`) — not a second template. The article page adds an “On this page” TOC when there are enough H2s, FAQ JSON-LD, and related cards from the same cluster. See [`content/blog/clusters.md`](../content/blog/clusters.md) and [`content/blog/voice.md`](../content/blog/voice.md).

## Overview

| Piece | Location |
| --- | --- |
| Topic calendar | [`content/blog/calendar.json`](../content/blog/calendar.json) |
| Topic clusters (hub + spokes) | [`content/blog/clusters.md`](../content/blog/clusters.md) |
| Keyword map (OpenSEO) | [`content/blog/KEYWORD_MAP.md`](../content/blog/KEYWORD_MAP.md) |
| Categories / rotation | [`content/blog/categories.md`](../content/blog/categories.md) |
| Voice + HTML skeletons | [`content/blog/voice.md`](../content/blog/voice.md) |
| Example drafts | `scripts/blog-automation/example-draft.json` (spoke) · `example-draft-pillar.json` (pillar) |
| Agent playbook | [`content/blog/AGENT_PLAYBOOK.md`](../content/blog/AGENT_PLAYBOOK.md) |
| Publish scripts | [`scripts/blog-automation/`](../scripts/blog-automation/) (`resolve-blog-id`, `sync-calendar`, `publish`, `mark-published`) |
| Cursor Automation | Mon + Thu; follow the playbook |

```text
resolve-blog-id → sync-calendar → pick queued topic → draft HTML + SEO → Magnific image → publish.mjs → mark calendar
```

## Shopify Dev Dashboard app

Shopify no longer issues a lasting `shpat_` token for new apps. Use **Dev Dashboard** client credentials.

1. Dev Dashboard → create app (e.g. `Afterstate Blog Publisher`)
2. App URL: `https://shopify.dev/apps/default-app-home` · do not embed in Admin
3. Scopes: `read_content`, `write_content`
4. Release, then **Install** on the Afterstate store
5. Settings → copy **Client ID** and **Client secret**
6. Confirm Fashion Blog exists with handle **`blog`** ([SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) §3b)

### Environment variables

| Variable | Required | Example |
| --- | --- | --- |
| `SHOPIFY_SHOP` | Yes | `rirapf-tf.myshopify.com` |
| `SHOPIFY_CLIENT_ID` | Yes (preferred) | Dev Dashboard Client ID |
| `SHOPIFY_CLIENT_SECRET` | Yes (preferred) | Dev Dashboard Client secret |
| `SHOPIFY_ADMIN_TOKEN` | No | Legacy `shpat_…` only |
| `SHOPIFY_BLOG_ID` | No | `gid://shopify/Blog/…` (from resolve script) |
| `SHOPIFY_API_VERSION` | No | `2025-10` (default) |

Put secrets in Cursor Automation **Secrets** (and `.env` locally if you publish by hand). Do **not** put the client secret in `SHOPIFY_ADMIN_TOKEN`.

```bash
npm run blog:resolve-id
# → prints SHOPIFY_BLOG_ID=gid://shopify/Blog/...
```

## Local publish (manual)

1. Write a draft JSON (see `scripts/blog-automation/example-draft.json`)
2. Generate or download a hero image via Magnific (see below)
3. Publish:

```bash
npm run blog:publish -- --file path/to/draft.json
npm run blog:mark-published -- --id <topicId> --handle <handle> --article-id gid://shopify/Article/...
```

## Magnific image rules

Use Magnific MCP only — **no scraping** random fashion CDNs.

### AI cover — Nano Banana 2

- Mode slug: `imagen-nano-banana-2-flash`
- Aspect: `3:2` or `16:9`
- Flow: `simulate_cost` → `images_generate` → `creations_show` → `creations_wait` → use final asset URL in `imageUrl`

### Real photo — Freepik stock

- `stock_search` with `content_type: "photo"`, prefer `license: "free"`
- `stock_download` (or `stock_to_creation` + wait) → URL for `imageUrl`

Credits: generations may consume Magnific credits unless unlimited applies in that session — check balance before large batches.

## SEO fields

`seoTitle` / `seoDescription` in the draft are stored as Shopify SEO metafields:

- `global.title_tag`
- `global.description_tag`

Storefront `article.seo` reads these for meta tags + JSON-LD.

## Fixing a bad post

1. Shopify Admin → **Online Store → Blog posts** → open the article on blog **Blog** / handle `blog`
2. Edit copy, SEO, or image — or **Unpublish**
3. Optionally update `content/blog/calendar.json` notes

Cache: blog loaders use `CacheShort()` so new posts appear sooner than long-lived catalog cache.

## Cursor Automation (2× / week)

Ready-to-paste draft: [`content/blog/CURSOR_AUTOMATION.md`](../content/blog/CURSOR_AUTOMATION.md).

After this repo content is **committed** on the branch the automation checks out:

1. Open Cursor **Agents Window → Automations** and create a new automation (or edit Agent Instructions on the existing one)
2. Use the name, cron (`0 9 * * 1,4` = Mon + Thu 09:00), tools, and instructions from that draft
3. Attach Magnific + OpenSEO MCP; set `SHOPIFY_SHOP` + `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET`
4. Confirm repo/branch and schedule timezone in the editor

After changing playbook/scripts, **push to `main`** and replace **Agent Instructions** with the block in `CURSOR_AUTOMATION.md`. Then click **Run** (do not wait for Thursday). Keep other cloud agents idle so the run is not rate-limited.

If a scheduled run is **Rate limited**, click **Run** later the same day — do not wait for the next Mon/Thu slot. Avoid other cloud agents at 11:00 GMT+2.

Do not rely on an open chat `/loop` for production cadence.
