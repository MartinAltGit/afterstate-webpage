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

1. Settings → Markets — enable markets you sell into
2. Ensure Storefront API `@inContext(country, language)` matches Hydrogen `i18n`
3. Translate metafield / metaobject content via Shopify Markets translations where needed

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

## Related docs

- [CONTENT_MODEL.md](./CONTENT_MODEL.md) — field semantics and ownership
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system overview
- GraphQL: `app/graphql/fragments/*`, `app/graphql/queries/*`
- Helpers: `app/lib/metafields.ts`, `app/lib/cache.ts`
