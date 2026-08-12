# Fashion Blog automation

Auto-publishes SEO fashion posts to Shopify blog handle **`blog`** **twice per week** (Monday + Thursday). No approval gate — edit or unpublish in Admin if something is wrong.

Storefront: `/blog` (cards) → `/blog/:handle` (full story). Journal stays separate.

## Overview

| Piece | Location |
| --- | --- |
| Topic calendar | [`content/blog/calendar.json`](../content/blog/calendar.json) |
| Keyword map (OpenSEO) | [`content/blog/KEYWORD_MAP.md`](../content/blog/KEYWORD_MAP.md) |
| Categories / rotation | [`content/blog/categories.md`](../content/blog/categories.md) |
| Voice + SEO brief | [`content/blog/voice.md`](../content/blog/voice.md) |
| Agent playbook | [`content/blog/AGENT_PLAYBOOK.md`](../content/blog/AGENT_PLAYBOOK.md) |
| Publish scripts | [`scripts/blog-automation/`](../scripts/blog-automation/) |
| Cursor Automation | Schedule every 48h; follow the playbook |

```text
Pick queued topic → draft HTML + SEO → Magnific image → publish.mjs → mark calendar
```

## Shopify Admin token

1. Shopify Admin → **Settings → Apps and sales channels → Develop apps**
2. Create an app (e.g. `Afterstate Blog Publisher`)
3. Configure Admin API scopes:
   - `write_content` (and `read_content` if listed separately)
   - Online Store / content scopes as required by your Admin API version for blogs & articles
4. Install the app on the store; copy the **Admin API access token**
5. Confirm Fashion Blog exists with handle **`blog`** ([SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) §3b)

### Environment variables

| Variable | Required | Example |
| --- | --- | --- |
| `SHOPIFY_SHOP` | Yes | `your-store` or `your-store.myshopify.com` |
| `SHOPIFY_ADMIN_TOKEN` | Yes | `shpat_…` |
| `SHOPIFY_BLOG_ID` | No | `gid://shopify/Blog/…` (from resolve script) |
| `SHOPIFY_API_VERSION` | No | `2025-10` (default) |

Put secrets in `.env` locally (gitignored) and in the Cursor Automation / CI secret store for scheduled runs.

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

1. Open Cursor **Agents Window → Automations** and create a new automation
2. Use the name, cron (`0 9 * * 1,4` = Mon + Thu 09:00), tools, and instructions from that draft
3. Attach Magnific + OpenSEO MCP; set `SHOPIFY_SHOP` + `SHOPIFY_ADMIN_TOKEN`
4. Confirm repo/branch and schedule timezone in the editor

Do not rely on an open chat `/loop` for production cadence.
