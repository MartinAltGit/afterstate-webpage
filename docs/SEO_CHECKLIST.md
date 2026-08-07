# SEO checklist — Afterstate

Use before production launch and after major IA or template changes. Strategy context: [`SEO_STRATEGY.md`](./SEO_STRATEGY.md).

Mark each item when verified on **production** (or staging that mirrors production env and `PUBLIC_SITE_URL`).

---

## Environment

- [ ] `PUBLIC_SITE_URL` is the public HTTPS origin (no trailing slash issues in canonical builder)
- [ ] Preview / Oxygen preview hosts emit `noindex`
- [ ] Production `robots.txt` allows catalog + content; does not block CSS/JS needed for rendering
- [ ] Sitemap reachable and submitted in Search Console

---

## Templates — meta

For each template family, spot-check 2–3 live URLs:

| Template | Unique title | Description | Canonical | OG image | robots |
| --- | --- | --- | --- | --- | --- |
| Home | [ ] | [ ] | [ ] | [ ] | index |
| Shop / collection | [ ] | [ ] | [ ] | [ ] | index |
| Product | [ ] | [ ] | [ ] | [ ] | index |
| Campaign | [ ] | [ ] | [ ] | [ ] | index |
| Lookbook | [ ] | [ ] | [ ] | [ ] | index |
| Journal index | [ ] | [ ] | [ ] | [ ] | index |
| Journal article | [ ] | [ ] | [ ] | [ ] | index |
| About / philosophy / care / size-guide / shipping-returns / contact | [ ] | [ ] | [ ] | [ ] | as intended |
| Cart | [ ] | [ ] | — | — | **noindex** |
| Account | [ ] | [ ] | — | — | **noindex** |
| Search | [ ] | [ ] | — | — | **noindex** |

- [ ] Product SEO overrides (`custom.seo_*`) win when set
- [ ] Default fallback description is not used on key commercial URLs

---

## Canonicals and duplicates

- [ ] No `www` / apex duplicate without redirect
- [ ] Locale URLs canonicalize to themselves (not always to default market)
- [ ] `/collections/all` redirects to `/shop`
- [ ] Legacy `/pages/*` and `/blogs/journal/*` redirect to Afterstate IA
- [ ] Faceted/filter URLs do not create indexable thin duplicates (canonicalize or noindex)
- [ ] Pagination: rel next/prev or clear canonical policy documented and implemented

---

## Markets / hreflang

- [ ] Alternates only for published markets
- [ ] `x-default` points to default market
- [ ] Invalid locale prefix returns 404
- [ ] MarketSelector does not create crawl traps (clean links)

---

## Structured data

- [ ] PDP Product JSON-LD validates; price/availability/currency match visible offer
- [ ] BreadcrumbList matches visible breadcrumbs
- [ ] Article JSON-LD on journal posts
- [ ] Organization / WebSite on home (SearchAction only if accurate)
- [ ] No structured data for out-of-stock false “InStock” when sold out

---

## Crawlability

- [ ] Primary nav links are real `<a href>` (not click-only divs)
- [ ] Product grids in initial HTML (SSR), not only client-fetched
- [ ] Images have meaningful `alt` where informative
- [ ] Soft 404s: missing product/collection/article return HTTP 404
- [ ] Sitemap URLs return 200 and are canonical

---

## Content quality (launch set)

- [ ] No lorem / Mock.shop demo titles on production
- [ ] Collection and campaign intros written
- [ ] PDP titles consistent; badges/metafields accurate
- [ ] Policies pages live and linked from footer
- [ ] Journal has at least the planned launch articles (or journal noindexed until ready)

---

## Post-launch monitoring (first 30 days)

- [ ] Search Console property verified
- [ ] Sitemap processed without hard errors
- [ ] Index coverage reviewed; fix excluded-by-robots surprises
- [ ] Core Web Vitals URLs checked against [`PERFORMANCE.md`](./PERFORMANCE.md)
- [ ] Spot-check rich results for 5 PDPs + 2 articles

---

## Sign-off

| Role | Name | Date |
| --- | --- | --- |
| Engineering | | |
| Content / brand | | |
| Launch owner | | |
