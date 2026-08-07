# Afterstate roadmap

Phased delivery. Each section is a distinct workstream — do not merge visual polish into foundation work, or SEO copy into unfinished IA.

Status legend: **Done** · **In progress** · **Next** · **Later** · **Launch**

---

## 1. Technical foundation

**Status: In progress**

Hydrogen app on Oxygen with Afterstate IA, wireframe UI, markets, SEO helpers, analytics stubs, and Shopify content model definitions documented.

| Work | Notes |
| --- | --- |
| Stack lock | Hydrogen `2026.4.4`, React Router `7.16`, CSS Modules, Oxygen |
| Route map | Locale `($locale)` commerce + editorial routes (see Architecture) |
| GraphQL layout | `app/graphql` fragments / queries; codegen |
| Cache helpers | Public vs private (`app/lib/cache.ts`) |
| SEO / JSON-LD primitives | `app/lib/seo`, `app/components/seo` |
| Consent + analytics stubs | `app/lib/consent`, `app/lib/analytics` |
| Docs | Architecture, Shopify setup, content model, markets, SEO, performance, a11y, analytics, deployment |
| Link real store | Replace Mock.shop for metafields / metaobjects / Markets |
| Playwright smoke | Critical commerce + a11y flows; CI typecheck / lint / build |
| Redirects | Admin + app aliases (`/collections/all` → `/shop`, blog/page paths) |

Exit criteria: production-capable commerce on a linked store; wireframe UI complete for primary IA; typecheck + lint + build green.

---

## 2. Shopify content entry

**Status: Next** (blocked on linked store + Admin definitions)

| Work | Notes |
| --- | --- |
| Metafield definitions | All `custom.*` product fields; Storefront API access on |
| Metaobject definitions | Homepage, campaign, lookbook, guides, etc. |
| Menus | `main-menu`, `footer` |
| Blog | Handle `journal` + seed articles |
| Catalog | Products, variants, collections, inventory, prices |
| Homepage sections | Ordered `homepage_section` entries |
| Campaign `afterstate-001-no-rush` | Bound collection + chapters |
| Policies | Shipping, returns, privacy, terms |
| Markets | Enable launch markets; currencies; shipping |

Exit criteria: Storefront API returns real editorial + catalog data; Mock.shop no longer required for demos.

Details: [`docs/SHOPIFY_SETUP.md`](docs/SHOPIFY_SETUP.md), [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md).

---

## 3. Final visual design

**Status: Later**

Wireframe tokens stay until brand art direction is approved. Then update tokens and surfaces — not commerce logic.

| Work | Notes |
| --- | --- |
| Typography | Expressive brand fonts; self-host; `font-display: swap` |
| Color / material | Brand palette in `tokens.css` only |
| Layout refinement | Spacing, rhythm, editorial product/collection layouts |
| Components | Replace wireframe chrome without changing props/data contracts |
| Responsive polish | Mobile PDP sticky buy, grids, drawers |

Exit criteria: First viewport passes brand test (brand is hero-level); no template-kit look; CSS Modules only.

---

## 4. Motion

**Status: Later** (after visual direction)

| Work | Notes |
| --- | --- |
| Motion system | 2–3 intentional motions minimum (presence / hierarchy, not noise) |
| `prefers-reduced-motion` | All motion respects reduced preference |
| Cart / drawer | Focus-safe open/close; no layout thrash (CLS) |
| No heavy libraries | Prefer CSS / small primitives over large animation deps |

Exit criteria: Motion budget documented in PERFORMANCE; reduced-motion verified.

---

## 5. Product photography

**Status: Later** (parallel with content entry where possible)

| Work | Notes |
| --- | --- |
| Hero / campaign stills | Full-bleed where IA requires; CDN via Shopify Files |
| PDP galleries | Consistent crop/ratio to protect CLS |
| Editorial / lookbook frames | `media_block` + `editorial_media` |
| Alt text | Meaningful product/context alts in Admin |
| Image pipeline | Width/height, responsive `Image`, lazy below-fold |

Exit criteria: No placeholder stock as primary brand image on key templates.

---

## 6. Copywriting

**Status: Later**

| Work | Notes |
| --- | --- |
| Brand voice | Homepage, about, philosophy, campaign intros |
| PDP storytelling | `design_story`, fit, fabric, care |
| Collection manifesto | `collection_manifesto` / campaign chapters |
| Microcopy | Empty states, errors, cart, sold out — professional, short |
| Policies UX | Clear shipping/returns language aligned with Admin policies |

Exit criteria: No skeleton/demo copy on production routes.

---

## 7. SEO content

**Status: Later** (engineering SEO layer earlier; content here)

| Work | Notes |
| --- | --- |
| Titles / descriptions | Unique per product, collection, journal, campaign |
| Metafield overrides | `seo_title_override`, `seo_description_override` where needed |
| Journal | Useful articles; internal links to shop IA |
| Structured data accuracy | Price, availability, brand, breadcrumbs match visible content |
| hreflang / Markets | Alternates only for real published markets |

Exit criteria: [`docs/SEO_CHECKLIST.md`](docs/SEO_CHECKLIST.md) complete for launch URLs.

---

## 8. Analytics

**Status: Next / Later**

| Work | Notes |
| --- | --- |
| Customer Privacy UI | Consent banner / preferences wired to Hydrogen 2026.4 consent |
| Event wiring | Replace stubs with Shopify Analytics (+ optional GTM) |
| Funnel events | View product/collection, search, add/remove cart, begin checkout, purchase |
| Market change | Track locale switches |
| QA | No tags fire before consent; purchase attribution verified |

Exit criteria: [`docs/ANALYTICS.md`](docs/ANALYTICS.md) providers live; consent gate verified.

---

## 9. QA

**Status: Later** (continuous smoke earlier)

| Work | Notes |
| --- | --- |
| Commerce | Variant select, cart, discount, checkout handoff |
| Markets | Locale URLs, currency, MarketSelector |
| SEO | Canonicals, robots, sitemap, JSON-LD validators |
| A11y | Keyboard, focus trap, live regions, contrast |
| Performance | Field data / lab against [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md) budgets |
| Cross-browser | Current Chromium, Safari, Firefox; iOS + Android |
| Error states | 404, empty collection/search, sold out, API failure UI |

Exit criteria: Playwright critical path green; checklist sign-off.

---

## 10. Launch

**Status: Launch**

| Work | Notes |
| --- | --- |
| Production Oxygen env | Secrets set; `PUBLIC_SITE_URL` correct |
| Custom domain | DNS + SSL via Shopify / Oxygen |
| Markets go-live | Shipping, taxes, duties configured |
| Indexing | Production `robots.txt` allows crawl; previews stay noindex |
| Redirects | Legacy Online Store paths mapped |
| Monitoring | Analytics + Oxygen logs + uptime |
| Rollback plan | Previous Oxygen deployment known |

Exit criteria: Buyable production site; checkout on Shopify; SEO/privacy/legal pages live.

---

## Dependency order (summary)

```text
Technical foundation
        ↓
Shopify content entry ──→ Copywriting / Photography (parallel)
        ↓
Final visual design → Motion
        ↓
SEO content + Analytics wiring
        ↓
QA → Launch
```

Do not block foundation on final photography or motion. Do not launch without consent-gated analytics policy, accurate policies, and performance/a11y budgets met on primary templates.
