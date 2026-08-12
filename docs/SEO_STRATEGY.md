# SEO strategy — Afterstate

Engineering and content rules for crawlable, non-duplicative storefront SEO. Implementation lives in `app/lib/seo`, `app/components/seo`, route `meta` exports, `[robots.txt].tsx`, and sitemap routes.

Related: [`SEO_CHECKLIST.md`](./SEO_CHECKLIST.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`MARKETS.md`](./MARKETS.md)

---

## Goals

1. Every indexable URL has a unique, accurate title and description
2. One canonical URL per piece of content (locale-aware)
3. SSR HTML exposes products, collections, nav, and pagination to crawlers
4. Private / utility surfaces are `noindex`
5. Structured data matches visible content
6. Markets use correct `hreflang` / alternates without inventing locales

---

## Title and description

**Site name:** Afterstate  
**Title pattern:** `{Page} — Afterstate` via `buildPageTitle` (`app/lib/seo/meta.ts`)

### Priority (products)

1. `custom.seo_title_override` / `custom.seo_description_override` if set
2. Shopify product `seo.title` / `seo.description`
3. Derived from product title / truncated description

### Priority (collections, pages, journal, campaigns)

1. Resource-level SEO fields or metaobject `seo_title` / `seo_description`
2. Title + short derived description
3. Site default description only as last resort:

> Afterstate — life beyond the rush. Clothes made for a slower, clearer pace.

Rules:

- Unique titles on all indexable templates
- Descriptions ~150–160 characters where practical; no keyword stuffing
- Do not put marketing slogans in every title; brand belongs in the suffix

---

## Canonical URLs

- Base origin from `PUBLIC_SITE_URL` in production (never preview host)
- Default market: unprefixed path (`/products/tee`)
- Other markets: `/{lang}-{country}/…` (e.g. `/en-gb/products/tee`)
- Canonical points to the **current locale’s** clean URL (no session/utm params)
- Filter/sort query params: canonicalize to the unfiltered collection URL when filters create thin duplicates; mark noisy filter combos `noindex` if retained

Helpers: `CanonicalUrl` component / SEO meta builders.

---

## Robots

| Surface | robots |
| --- | --- |
| Product, collection, shop, journal article, blog article, campaign, lookbook, about, philosophy, care, size-guide, shipping-returns, contact (if public), policies | `index,follow` (unless unpublished) |
| Cart | `noindex,nofollow` |
| Account (`/account/*`) | `noindex,nofollow` |
| Search (`/search`) | `noindex,follow` |
| Preview / Oxygen preview hosts | `noindex` |
| Empty or error utility states | Prefer `noindex` when not a real resource |

`robots.txt` (`app/routes/[robots.txt].tsx`) must allow crawling of catalog and content; disallow account/cart if desired; point to sitemap.

---

## Sitemap

- Locale-aware sitemap routes (`($locale).[sitemap.xml].tsx` + typed pages)
- Include: products, collections, journal articles, fashion blog articles, key static pages, campaigns/lookbooks that are public
- Exclude: cart, account, search, internal previews
- Keep lastmod honest when available; do not invent changefreq theater

---

## hreflang / Markets

- Emit alternate links for **published** Europe markets only (`en`, `en-GB`, `de-DE`, `fr-FR`)
- `x-default` → default EN-EU market (unprefixed `/`)
- Invalid locale prefixes 404; `/en-eu` and `/en-nl` 301 to unprefixed URLs
- English-first content is fine at launch; still emit alternates so currency/context URLs are distinct

Implementation: `buildDocumentSeoMeta` from root `meta` (`app/lib/seo/document.ts`). Set `PUBLIC_SITE_URL` in production.

See [`MARKETS.md`](./MARKETS.md).

---

## Open Graph / Twitter

From `buildMetaTags`:

- `og:site_name`, `og:title`, `og:description`, `og:type` (`website` | `article` | `product`)
- `og:url` when canonical known
- `og:image` (+ alt) from product/collection/article primary media
- Twitter `summary_large_image` when image present

Images: absolute HTTPS Shopify CDN URLs; stable aspect for shares.

---

## Structured data (JSON-LD)

Server-rendered with page content (`app/components/seo/JsonLd.tsx`):

| Type | Where |
| --- | --- |
| Organization / OnlineStore | Root / home |
| WebSite (+ SearchAction if search is public UX) | Root / home |
| Product (+ Offer / variant accuracy) | PDP |
| BreadcrumbList | Product, collection, journal, nested IA |
| Article | Journal article |
| CollectionPage | Collection where valid |

Rules:

- Price, currency, availability must match the **current market context**
- Do not mark up content not visible on the page
- Validate with Google Rich Results / Schema validators before launch

---

## Information architecture and crawl path

Primary indexable hubs:

- `/` homepage
- `/shop` and `/collections/:handle`
- `/products/:handle`
- Campaign e.g. `/afterstate-001-no-rush`
- `/journal`, `/journal/:article`
- `/blog`, `/blog/:article`
- `/lookbook/:handle`
- Brand/utility: `/about`, `/philosophy`, `/size-guide`, `/care`, `/shipping-returns`, `/contact`

Avoid duplicate shop surfaces: redirect `/collections/all` → `/shop`. Prefer Admin redirects for legacy Online Store `/pages/*`, `/blogs/journal/*`, and `/blogs/blog/*` paths (see Architecture redirect table).

Internal linking: header/footer menus from Shopify; breadcrumbs; related / complete-the-look; journal → product links where editorial; blog → topical internal links for SEO.

---

## Content SEO (editorial)

Engineering ships the system; content owns quality:

- Collection intros / manifesto with real language (not lorem)
- PDP metafields: fabric, fit, story — useful to buyers and crawlers
- Journal articles that earn links and explain the brand/product
- Campaign pages as landing experiences with unique titles

Do not chase volume pages. Prefer fewer strong URLs.

---

## Performance and SEO

Core Web Vitals affect ranking and UX. Budgets: [`PERFORMANCE.md`](./PERFORMANCE.md). SSR + focused GraphQL + optimized images are the default; do not client-only render primary product content.

---

## Measurement

- Search Console (production property) after domain live
- Index coverage, sitemaps, Core Web Vitals
- Manual spot-checks of rich results for PDP and Article

Analytics pageviews are not a substitute for Search Console.
