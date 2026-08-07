# Content model — Afterstate

Canonical content model for products, collections, journal, and editorial metaobjects. Admin creation steps live in [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md).

---

## Principles

1. **Shopify is the CMS** — products, collections, blogs, menus, metafields, metaobjects
2. **Hydrogen reads via Storefront API** — no duplicate CMS
3. **Over-fetching is avoided** — card fragments stay lean; PDP pulls full metafields
4. **Namespace** for product metafields: `custom`
5. **Metaobject types** use snake_case API identifiers listed below

---

## Standard Shopify resources

| Resource | Role on site |
| --- | --- |
| Product + variants | Catalog, PDP, cart |
| Collection | Shop grids, campaign binding |
| Menu | Header / footer |
| Page | Static pages (about, care, etc.) when not metaobject-driven |
| Blog `journal` + articles | Journal index + article detail |
| Policy | Legal pages |
| Market | Locale / currency context |
| Customer / Order | Account (Customer Account API — never cached) |

---

## Product metafields (`custom`)

Owner: **Product**. All keys below are under namespace `custom`.

| Key | GraphQL alias | Shopify type | Used on | Purpose |
| --- | --- | --- | --- | --- |
| `subtitle` | `subtitle` | Single line text | Card, PDP | Short line under title |
| `collection_number` | `collectionNumber` | Single line text | PDP | Drop / collection code |
| `fit` | `fit` | Single line text | PDP | Fit label |
| `fit_notes` | `fitNotes` | Multi-line text | PDP | Fit guidance |
| `fabric` | `fabric` | Single line text | PDP | Fabric name |
| `fabric_composition` | `fabricComposition` | Multi-line text | PDP | Fibre breakdown |
| `fabric_weight_gsm` | `fabricWeightGsm` | Integer | PDP | Weight in gsm |
| `construction` | `construction` | Multi-line text | PDP | Construction notes |
| `measurements` | `measurements` | JSON | PDP | Measurement table / JSON |
| `model_information` | `modelInformation` | Multi-line text | PDP | Model height / size |
| `design_story` | `designStory` | Multi-line text | PDP | Narrative block |
| `care_instructions` | `careInstructions` | Multi-line text | PDP | Care copy |
| `size_guide` | `sizeGuide` | Multi-line text | PDP | Inline size guide (or later MO ref) |
| `shipping_note` | `shippingNote` | Multi-line text | PDP | Shipping callout |
| `product_badge` | `productBadge` | Single line text | Card, PDP | Badge label |
| `editorial_media` | `editorialMedia` | List of files | PDP | Story gallery images |
| `related_products` | `relatedProducts` | List of products | PDP | Related rail |
| `complete_the_look` | `completeTheLook` | List of products | PDP | Outfit rail |
| `seo_title_override` | `seoTitleOverride` | Single line text | SEO layer | Title override |
| `seo_description_override` | `seoDescriptionOverride` | Multi-line text | SEO layer | Description override |

### Reading in app code

Fragments: `app/graphql/fragments/product.ts`  
Helper: `getProductMetafields(product)` in `app/lib/metafields.ts`

```ts
import {getProductMetafields} from '~/lib/metafields';

const meta = getProductMetafields(product);
// meta.subtitle, meta.relatedProducts, meta.editorialMedia, …
```

### Fragment strategy

| Fragment | When |
| --- | --- |
| `PRODUCT_CARD_FRAGMENT` | Grids, rails — id, title, handle, image, price, optional subtitle |
| `PRODUCT_METAFIELDS_FRAGMENT` | PDP / storytelling only |
| `PRODUCT_DETAIL_FRAGMENT` | Full PDP query |

---

## Collection content

Collections use native Shopify fields (`title`, `description`, `image`, `seo`) plus optional metaobject binding:

- `collection_manifesto` — long-form intro for a collection page
- `campaign` / `collection_chapter` — campaign experience while products still come from the Shopify collection

Fragments: `COLLECTION_CARD_FRAGMENT`, `COLLECTION_DETAIL_FRAGMENT`.

---

## Metaobjects

| Type | Purpose | Typical fields |
| --- | --- | --- |
| `homepage_section` | Ordered homepage blocks | `section_type`, `title`, `body`, `media`, `products`, `sort_order` |
| `campaign` | Campaign / drop page | `title`, `slug`, `hero_media`, `chapters`, `collection` |
| `collection_chapter` | Campaign chapter | `title`, `body`, `media`, `products` |
| `lookbook` | Lookbook page | `title`, `slug`, `frames`, `products` |
| `editorial_story` | Reusable editorial block | `title`, `body`, `media` |
| `size_guide` | Shared size guide | `title`, `body`, `chart_json` |
| `care_guide` | Shared care content | `title`, `instructions` |
| `material` | Material library | `name`, `description`, `composition` |
| `quote` | Pull quote | `text`, `attribution` |
| `media_block` | Lookbook / editorial frame | `media`, `caption`, `layout` |
| `collection_manifesto` | Collection intro | `title`, `body`, `collection` |
| `product_story` | Reusable product narrative | `title`, `body`, `media` |
| `campaign_credit` | Campaign credit line | `role`, `name` |

Queries: `app/graphql/queries/homepage.ts`, `app/graphql/queries/campaign.ts`.

Loaders should `.catch()` metaobject queries when targeting mock.shop or stores without definitions yet.

---

## Journal

| Shopify | Route |
| --- | --- |
| Blog handle `journal` | `/journal` |
| Article | `/journal/:articleHandle` |

Queries: `JOURNAL_INDEX_QUERY`, `JOURNAL_ARTICLE_QUERY` in `app/graphql/queries/journal.ts`.

---

## Homepage composition

1. Query `metaobjects(type: "homepage_section", first: 20)`
2. Sort by `sort_order` (or Admin order)
3. Map `section_type` → component in `app/sections/` registry
4. Fallback: featured collection + recommended products if metaobjects empty

---

## Caching (summary)

| Content | Strategy |
| --- | --- |
| Products, collections, journal, homepage sections, campaigns | `CacheShort()` |
| Menus, shop brand, policies | `CacheLong()` |
| Predictive search | `CacheNone()` |
| Cart, customer | No shared cache |

Details: `app/lib/cache.ts`.

---

## SEO overrides

Prefer Shopify native product SEO, then metafields:

1. `custom.seo_title_override` / `custom.seo_description_override` if set
2. Else product `seo.title` / `seo.description`
3. Else derived from title / description

---

## Related

- [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) — exact Admin steps
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system architecture
