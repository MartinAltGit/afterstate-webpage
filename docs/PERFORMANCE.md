# Performance — Afterstate

Measurable budgets for the Hydrogen storefront on Oxygen. Optimize for mobile p75 field data; use lab tools for regression, not as the only gate.

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`SEO_STRATEGY.md`](./SEO_STRATEGY.md)

---

## Core Web Vitals (required)

| Metric | Budget | How to read |
| --- | --- | --- |
| **LCP** | ≤ **2.5s** | Largest contentful paint — usually hero image or H1 block on home/PDP/collection |
| **INP** | ≤ **200ms** | Interaction to next paint — nav, variant select, add to cart, drawers |
| **CLS** | ≤ **0.1** | Cumulative layout shift — reserved media boxes, font swap, drawer/cart |

Targets apply to primary templates: home, shop/collection, PDP, campaign. Measure p75 on real devices (CrUX / RUM) when live; Lighthouse/WebPageTest for PR checks.

---

## JavaScript budget

| Scope | Budget | Notes |
| --- | --- | --- |
| Critical route JS (gzipped, above-the-fold path) | ≤ **200 KB** preferred | Prefer smaller; fail review if unbounded growth |
| Avoid | Large animation / UI kits | No shadcn-style kits; no heavy motion libraries in foundation |
| Hydration | Keep client islands minimal | SSR commerce content; client for cart drawer, selectors, consent |

Practices:

- Route-level code splitting via React Router / Vite
- Do not ship unused GraphQL fields (focused fragments)
- Defer nonessential client scripts until after consent + idle where possible

Measure: build output / bundle analyzer on CI when available; compare route chunks over time.

---

## Images

| Rule | Budget / requirement |
| --- | --- |
| Format | Shopify CDN modern formats (WebP/AVIF via Hydrogen `Image` where supported) |
| Hero / LCP image | **Not** `loading="lazy"`; explicit width/height or aspect-ratio box |
| Below-fold | Lazy-load; `sizes` accurate for grid breakpoints |
| PDP gallery | Stable aspect ratio to protect CLS; avoid layout jump on variant image swap |
| Max decorative weight | Prefer editorial restraint; no multi-MB heroes |
| Srcset | Responsive widths for card (~200–600w) and hero (~800–2000w) as design requires |

Never use unsized images in the first viewport. CLS from images is treated as a bug.

---

## Fonts

| Phase | Policy |
| --- | --- |
| Wireframe | System / single neutral stack — zero webfont cost |
| Brand phase | Self-host; subset; **`font-display: swap`** (or optional `optional` for noncritical) |
| Files | WOFF2 only; limit to **2 families** / **≤ 4 files** total preferred |
| FOIT/FOUT | Reserve line-height/metrics in tokens to limit CLS ≤ 0.1 |

Do not load Google Fonts CDN if self-hosting is available. Do not block rendering on multiple weights.

---

## Third parties

| Category | Policy |
| --- | --- |
| Analytics / ads / chat | **Consent-gated**; no network before allow |
| Shopify Customer Privacy | Required for compliance wiring |
| Tag managers | One container max if used; load after consent |
| Embeds (video, maps) | Facades / click-to-load; no autoplay heavy embeds in LCP path |
| A/B tools | Prefer server-side; if client, count toward JS + INP budget |

Every third-party script must have an owner and a removal criterion. Default is **none** beyond Shopify platform needs.

---

## Server / Hydrogen

| Practice | Expectation |
| --- | --- |
| SSR | Primary HTML for products, collections, nav |
| Caching | `CacheShort` / `CacheLong` for public Storefront data; never cache cart/account |
| GraphQL | Fragment-driven; card queries lean |
| TTFB | Keep Oxygen + Storefront cache warm for catalog; watch loader waterfalls |
| Streaming | Use React Router / Hydrogen streaming where it helps LCP without blank shells |

---

## Template-specific LCP candidates

| Template | Likely LCP | Guardrails |
| --- | --- | --- |
| Home | Hero media or opening statement | One dominant image; prioritized fetch |
| Collection | First product image or collection hero | Grid images sized; hero not lazy |
| PDP | Primary product image | Width/height; avoid font + image both fighting LCP |
| Campaign | Campaign hero | Full-bleed optimized CDN asset |

---

## INP hotspots

Watch and profile:

- Variant / size selection
- Add to cart + cart drawer open
- Mobile nav / market selector
- Predictive search open/type
- Filter apply on collections

Keep handlers short; avoid large synchronous layout work; respect `prefers-reduced-motion` without blocking paint.

---

## CLS hotspots

- Web fonts swapping into different metrics
- Cart drawer / announcement bar injecting late
- Images without dimensions
- Sticky mobile buy bar appearing without reserved space

---

## Measurement workflow

1. **Local:** Lighthouse mobile on `npm run preview` for home, collection, PDP
2. **PR / release:** Compare LCP/INP/CLS and JS chunk sizes against this doc
3. **Production:** Search Console CWV + optional RUM
4. **Regression:** Any new dependency must justify bytes and main-thread time

### Lab pass criteria (merge gate aspirational)

| Check | Pass |
| --- | --- |
| Lighthouse LCP (lab, throttled mobile) | ≤ 2.5s on primary templates or improving toward it |
| CLS | ≤ 0.1 |
| No new unbounded third-party | Documented exception required |

Lab variance is expected; do not chase Lighthouse score vanity — chase the budgets above.

---

## Explicit non-goals (foundation)

- Pixel-perfect brand motion at the cost of INP
- Multiple carousels autoplaying in the first viewport
- Client-only product grids for SEO/LCP pages
