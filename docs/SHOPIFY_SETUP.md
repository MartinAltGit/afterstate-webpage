# Shopify setup — Afterstate

Step-by-step Admin setup for the Hydrogen storefront. Create definitions in **Settings → Custom data** (metafields / metaobjects), then enable **Storefront API** access on each definition.

> Mock.shop does not support custom metafields or metaobjects. Link a real development store for editorial content.

---

## Prerequisites

1. Shopify development or production store
2. Headless / Hydrogen custom storefront with Storefront API token
3. Admin access to **Settings → Custom data**
4. Blog created with handle `journal` (Online Store → Blog posts → manage blogs)

---

## 1. Product metafield definitions

**Path:** Settings → Custom data → Products → Add definition

For each row below:

1. Click **Add definition**
2. Set **Name** (display) and **Namespace and key** = `custom.<key>`
3. Choose **Type** exactly as listed
4. Under **Storefronts**, enable **Storefront API access** (read)
5. Save

| Name | Namespace and key | Type | Owner | Notes |
| --- | --- | --- | --- | --- |
| Subtitle | `custom.subtitle` | Single line text | Product | Card + PDP eyebrow |
| Collection number | `custom.collection_number` | Single line text | Product | e.g. `001` |
| Fit | `custom.fit` | Single line text | Product | e.g. `Relaxed` |
| Fit notes | `custom.fit_notes` | Multi-line text | Product | |
| Fabric | `custom.fabric` | Single line text | Product | Fabric name |
| Fabric composition | `custom.fabric_composition` | Multi-line text | Product | e.g. `100% organic cotton` |
| Fabric weight (gsm) | `custom.fabric_weight_gsm` | Integer | Product | Store as number string |
| Construction | `custom.construction` | Multi-line text | Product | |
| Measurements | `custom.measurements` | JSON | Product | Structured size chart JSON, or multi-line if preferred |
| Model information | `custom.model_information` | Multi-line text | Product | Height / size worn |
| Design story | `custom.design_story` | Multi-line text | Product | Long-form storytelling |
| Care instructions | `custom.care_instructions` | Multi-line text | Product | Or metaobject ref once `care_guide` exists |
| Size guide | `custom.size_guide` | Multi-line text | Product | Or metaobject ref to `size_guide` |
| Shipping note | `custom.shipping_note` | Multi-line text | Product | PDP shipping callout |
| Product badge | `custom.product_badge` | Single line text | Product | e.g. `New`, `Limited` |
| Editorial media | `custom.editorial_media` | List of files | Product | Images for story gallery |
| Related products | `custom.related_products` | List of product references | Product | Max ~12 |
| Complete the look | `custom.complete_the_look` | List of product references | Product | Outfit rail |
| SEO title override | `custom.seo_title_override` | Single line text | Product | Overrides default SEO title |
| SEO description override | `custom.seo_description_override` | Multi-line text | Product | Overrides meta description |

### Enabling Storefront API access

On each metafield definition:

1. Open the definition
2. **Storefronts** → turn on access for the Hydrogen storefront
3. Save

Without this, Storefront GraphQL returns `null` for that metafield even if Admin shows a value.

---

## 2. Metaobject definitions

**Path:** Settings → Custom data → Metaobjects → Add definition

For each type:

1. **Type** (API identifier) must match exactly (snake_case below)
2. Add fields as listed
3. Enable **Storefront API access** on the definition
4. Optionally enable **Web pages** / publishable status if used as standalone URLs

### `homepage_section`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `section_type` | Single line text | Yes | Registry key: `hero`, `editorial`, `product_rail`, `lookbook`, `quote`, etc. |
| `title` | Single line text | No | |
| `body` | Multi-line text | No | |
| `cta_label` | Single line text | No | |
| `cta_url` | URL | No | |
| `media` | File | No | Hero / section image |
| `media_gallery` | List of files | No | |
| `products` | List of product references | No | Product rail |
| `collection` | Collection reference | No | |
| `sort_order` | Integer | No | Lower = earlier |

Query: `metaobjects(type: "homepage_section", first: 20)` — see `app/graphql/queries/homepage.ts`.

### `campaign`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `slug` | Single line text | Yes | Match route handle |
| `hero_media` | File | No | |
| `intro` | Multi-line text | No | |
| `chapters` | List of metaobject references → `collection_chapter` | No | |
| `credits` | List of metaobject references → `campaign_credit` | No | |
| `products` | List of product references | No | |
| `collection` | Collection reference | No | Bound Shopify collection |
| `seo_title` | Single line text | No | |
| `seo_description` | Multi-line text | No | |

### `collection_chapter`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `body` | Multi-line text | No | |
| `media` | File | No | |
| `products` | List of product references | No | |
| `sort_order` | Integer | No | |

### `lookbook`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `slug` | Single line text | Yes | |
| `hero_media` | File | No | |
| `frames` | List of metaobject references → `media_block` | No | |
| `products` | List of product references | No | |

### `editorial_story`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `body` | Multi-line text | No | |
| `media` | File | No | |

### `size_guide`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `body` | Multi-line text | No | |
| `chart_json` | JSON | No | Optional structured table |

### `care_guide`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `instructions` | Multi-line text | Yes | |

### `material`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | Single line text | Yes | |
| `description` | Multi-line text | No | |
| `composition` | Single line text | No | |

### `quote`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `text` | Multi-line text | Yes | |
| `attribution` | Single line text | No | |

### `media_block`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `media` | File | Yes | |
| `caption` | Single line text | No | |
| `layout` | Single line text | No | e.g. `full`, `split` |

### `collection_manifesto`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | Yes | |
| `body` | Multi-line text | Yes | |
| `collection` | Collection reference | No | |

### `product_story`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Single line text | No | |
| `body` | Multi-line text | Yes | |
| `media` | List of files | No | |

### `campaign_credit`

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `role` | Single line text | Yes | e.g. `Photography` |
| `name` | Single line text | Yes | |

---

## 3. Journal blog

1. Online Store → Blog posts → **Manage blogs**
2. Create blog with **Handle** = `journal` (exact)
3. Add articles; ensure they are published
4. Storefront queries use `blog(handle: "journal")` — see `app/graphql/queries/journal.ts`

Brand essays, quality standards, Afterstate voice. Routes: `/journal`, `/journal/:articleHandle`.

---

## 3b. Fashion Blog

1. Online Store → Blog posts → **Manage blogs**
2. Create a **second** blog with **Handle** = `blog` (exact) — title can be “Blog” or “Fashion”
3. Add posts for trends, fashion-world stories, culture — publish when ready
4. Fill SEO title / description on the blog and each article in Admin
5. Storefront queries use `blog(handle: "blog")` — see `app/graphql/queries/blog.ts`

Routes: `/blog`, `/blog/:articleHandle`. Legacy `/blogs` and `/blogs/blog/*` redirect here.

Do **not** publish fashion-trend posts into the `journal` blog — keep the two handles separate for IA and SEO.

### Automated publishing (SEO)

Afterstate can auto-publish **2 posts per week** (Mon + Thu) via Admin API + Magnific images + OpenSEO research.

1. Create a custom Admin app with **content write** scopes (`write_content` / blogs & articles)
2. Set env: `SHOPIFY_SHOP`, `SHOPIFY_ADMIN_TOKEN` (optional `SHOPIFY_BLOG_ID`)
3. Resolve blog GID: `npm run blog:resolve-id`
4. Follow [`docs/BLOG_AUTOMATION.md`](./BLOG_AUTOMATION.md) and [`content/blog/AGENT_PLAYBOOK.md`](../content/blog/AGENT_PLAYBOOK.md)
5. Schedule a Cursor Automation **Mon + Thu** (`0 9 * * 1,4`) — Magnific + OpenSEO MCP

Publisher script: `npm run blog:publish -- --file draft.json`

---

## 4. Menus

Create menus in Online Store → Navigation:

| Menu handle | Purpose |
| --- | --- |
| `main-menu` | Primary header (Hydrogen default) |
| `footer` | Footer links |

Update handles in `app/lib/fragments.ts` / root loader if you rename them.

---

## 5. Markets & localization

Currency on the Hydrogen storefront comes from Shopify Markets via `@inContext(country)` — it is **not** converted in React.

Afterstate defaults to **English Europe** (`country: NL` → **EUR** when your Europe market uses euros).

1. **Settings → Markets** — enable a Europe (or Netherlands / Eurozone) market with **EUR** as the currency
2. Optionally keep United Kingdom (GBP) as a separate market — Afterstate does **not** sell to the US
3. Align Hydrogen locales with those markets:
   - `/` (default) → `EN` + `NL` → EUR (`/en-eu` 301s here)
   - `/en-gb` → `EN` + `GB` → GBP
   - `/de-de` → `DE` + `DE` → EUR
   - `/fr-fr` → `FR` + `FR` → EUR
4. If the whole shop should be euro-only, set **Settings → Store details → Store currency** to EUR (or make Europe the primary market)
5. Translate metafield / metaobject content via Shopify Markets translations where needed
6. Set `PUBLIC_SITE_URL` to the production HTTPS origin for canonicals / hreflang / sitemap

> Until Markets (or store currency) exposes EUR for `NL` / `DE` / `FR`, the Storefront API will keep returning the shop currency (e.g. GBP).

---

## 6. Verify from Hydrogen

```bash
# After linking the store and adding definitions:
npm run codegen   # or shopify hydrogen codegen
```

Smoke-check in a loader:

```ts
await storefront.query(HOMEPAGE_SECTIONS_QUERY, {
  cache: storefront.CacheShort(),
}).catch(() => null);
```

If metaobjects return empty, confirm Storefront API access on the definition and that entries are published.

---

## 7. Welcome discount + email capture (no login)

The storefront uses email capture for newsletter and sold-out **Make a demand** — not customer accounts.

### Welcome discount (`Welcome20`)

The storefront only **attaches** the code to the cart. Shopify must have a matching discount or nothing comes off the price.

#### Quick setup for testing

1. **Shopify Admin → Discounts → Create discount**
2. **Amount off order** → **Percentage** → **20%**
3. Discount code: `Welcome20` (must match `app/lib/welcomeOffer.ts`)
4. **Leave eligibility open** while testing (all customers, no first-order limit)
5. Save → add a product to cart → apply `Welcome20` (bar link or cart field)
6. Subtotal should drop once Shopify marks the code applicable

Mock.shop / unlinked stores cannot host your custom codes — use a real dev store.

#### Before launch (first-order only)

1. Edit `Welcome20`
2. **Limit to one use per customer** — on
3. **Customer eligibility** → customers who have **not previously purchased**
4. Save

**How first-order tracking works:** Hydrogen does not count orders. Shopify does — at checkout, against the buyer’s email / customer record. Guests can attach the code on the cart; Shopify decides if it discounts when they check out.

### Newsletter + demand webhook

Forms POST to `/subscribe`. To store emails (Klaviyo, Shopify Email via Zapier/Make, etc.):

1. Create a webhook endpoint that accepts JSON:

```json
{
  "email": "guest@example.com",
  "intent": "newsletter",
  "source": "footer",
  "productHandle": optional,
  "productTitle": optional,
  "capturedAt": "ISO-8601"
}
```

`intent` is `newsletter` or `demand`.

2. Set Oxygen / local env:

```bash
NEWSLETTER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
```

Without this variable, subscribe/demand forms fail closed (no false success, no email logged). Set the webhook before launch — required for capture to work.

Checkout email + marketing consent still collect buyers automatically — this path is for visitors who have not purchased yet.

---

## Related docs

- [CONTENT_MODEL.md](./CONTENT_MODEL.md) — field semantics and ownership
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system overview
- GraphQL: `app/graphql/fragments/*`, `app/graphql/queries/*`
- Helpers: `app/lib/metafields.ts`, `app/lib/cache.ts`
