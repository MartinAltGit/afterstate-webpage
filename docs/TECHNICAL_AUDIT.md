# Technical audit — foundation phase

Date: 2026-08-06  
Project: Afterstate Hydrogen storefront  
Phase: Technical foundation (editorial wireframe)

## Stack verified

| Item | Value |
| --- | --- |
| `@shopify/hydrogen` | 2026.4.4 |
| Project / skeleton | 2026.4.5 |
| `react-router` | 7.16.0 |
| Styling | CSS Modules + `tokens.css` |
| Markets | Locale subfolders (`($locale)`) |
| Data | Mock.shop (ready to link real store) |
| Checks | `npm run typecheck` pass, `npm run lint` pass (0 errors), `npm run build` pass |

## Delivered

- Architecture and content-model documentation under `docs/`
- Wireframe design tokens and layout shell (Afterstate chrome, not Hydrogen starter UI)
- Component folders: layout, navigation, commerce, product, collection, content, search, account, forms, seo, feedback
- GraphQL fragments/queries for products, collections, homepage, journal, campaign
- Product metafield helpers + Admin setup docs
- Routes: home, shop, collections, products, campaign, journal, lookbook, about, philosophy, size-guide, care, shipping-returns, contact, search, cart, account, policies, sitemap, robots
- Redirects: `/collections/all` → `/shop`, `/blogs/*` → `/journal`
- SEO helpers + JSON-LD components; robots disallow cart/account/search
- Analytics + consent stubs (no nonessential scripts pre-consent)
- Playwright critical flows under `tests/e2e`

## Known foundation limits (expected)

- Mock.shop has no Afterstate metafields/metaobjects/journal — UI degrades gracefully (empty states / omitted sections)
- Customer Account API requires linked store + domain setup for full login flows
- Final brand typography, color, photography, and motion are intentionally not shipped
- Analytics `track()` is a consent-gated stub until Shopify Customer Privacy + provider wiring
- Homepage sections registry supports metaobjects; default composition used when metaobjects are absent

## Next phase priorities

1. Link Afterstate Shopify store; create metafields/metaobjects per `docs/SHOPIFY_SETUP.md`
2. Enter Afterstate 001 products and campaign content
3. Final visual design on top of tokens without rewriting commerce
4. Enable Customer Account on Oxygen domain
5. Expand Playwright against real catalog data
