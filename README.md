# Afterstate

Hydrogen storefront for Afterstate — life beyond the rush. Shopify is the commerce and content backend; this app owns presentation, SEO, caching, and interaction on Oxygen.

| | |
| --- | --- |
| Stack | Hydrogen `2026.4.4`, React Router `7.16`, Vite 8, TypeScript |
| Styling | CSS Modules + CSS custom properties (`app/styles/tokens.css`) |
| Hosting | Shopify Oxygen |
| Storefront / Customer Account API | `2026-04` |
| Node | `22.x` or `24.x` |

Architecture and IA: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Full doc index is at the bottom of this file.

---

## Prerequisites

- Node.js 22 or 24
- npm (lockfile is committed)
- Shopify CLI via project dependency (`@shopify/cli`)
- Optional: a Shopify development store for real catalog / metafields / Customer Account

---

## Local setup

```bash
npm install
npm run dev
```

Dev server starts via `shopify hydrogen dev --codegen` (Vite + Mini Oxygen + GraphQL codegen watch).

### Mock.shop (default foundation)

Without a linked store, Hydrogen serves [Mock.shop](https://mock.shop) catalog data. Use this for layout, routing, cart UX, and component work.

Limitations:

- No custom metafields or metaobjects
- No real Customer Account / Markets setup
- Editorial homepage sections and campaign content will fall back or be empty

Metaobject/metafield loaders should tolerate empty responses when targeting Mock.shop.

### Linking a real Shopify store

```bash
npx shopify hydrogen link
npx shopify hydrogen env pull
```

Then create metafields, metaobjects, menus, and the `journal` blog per [`docs/SHOPIFY_SETUP.md`](docs/SHOPIFY_SETUP.md).

Customer Account API (`/account`) needs a public tunnel domain for local OAuth. Follow [Shopify’s Customer Account setup for Hydrogen](https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen).

---

## Environment variables

Do not commit `.env`. Pull from Oxygen after linking, or set locally:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | Yes | Signs session cookies |
| `PUBLIC_STORE_DOMAIN` | Yes* | Shop domain (e.g. `your-store.myshopify.com`) |
| `PUBLIC_STOREFRONT_API_TOKEN` | Yes* | Public Storefront API token |
| `PRIVATE_STOREFRONT_API_TOKEN` | Recommended | Private Storefront token (server) |
| `PUBLIC_STOREFRONT_ID` | Analytics | Storefront ID for Shopify analytics |
| `PUBLIC_CHECKOUT_DOMAIN` | Checkout / consent | Checkout host for Customer Privacy |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | Account | Customer Account API client |
| `PUBLIC_CUSTOMER_ACCOUNT_API_URL` | Account | Customer Account API URL |
| `PUBLIC_SITE_URL` | Production SEO | Absolute site origin for canonicals (`https://afterstate.store`) |
| `NEWSLETTER_WEBHOOK_URL` | Required for subscribe/demand | Zapier / Make / Klaviyo webhook for newsletter + demand emails |
| `STOREFRONT_PASSWORD` | Temporary lock | When set, visitors must enter this password. Unset to open the store. Never prefix with `PUBLIC_`. |

\*Injected / optional when running against Mock.shop via Hydrogen CLI defaults.

`SESSION_SECRET` must be set or the app throws on boot (`app/lib/context.ts`).

---

## Commands

| Command | Script | What it does |
| --- | --- | --- |
| Dev | `npm run dev` | Local Hydrogen + codegen watch |
| Build | `npm run build` | Production build (`shopify hydrogen build --codegen`) |
| Preview | `npm run preview` | Build then Mini Oxygen preview |
| Lint | `npm run lint` | ESLint (a11y + React + import rules) |
| Typecheck | `npm run typecheck` | `react-router typegen` + `tsc --noEmit` |
| Codegen | `npm run codegen` | Storefront + Customer Account types + RR typegen |

### Tests

Playwright e2e and CI smoke are planned (`tests/e2e/` per architecture). There is no `test` script in `package.json` yet — add Playwright when the wireframe commerce flows are stable. Until then:

```bash
npm run typecheck
npm run lint
npm run build
```

---

## Deployment

Host on **Shopify Oxygen**:

```bash
npx shopify hydrogen link          # once
npx shopify hydrogen env pull      # sync env locally
npx shopify hydrogen deploy        # deploy to Oxygen
```

Details: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

Preview / non-production hosts must remain `noindex`.

---

## Project conventions

- **React Router, not Remix** — import routing APIs from `react-router` (never `@remix-run/*`, never `react-router-dom` for app code). See `.cursor/rules/hydrogen-react-router.mdc`.
- **Shopify is the CMS** — products, collections, menus, blog `journal`, metafields, metaobjects. No second database.
- **CSS Modules** for component styles; design tokens in `app/styles/tokens.css`.
- **Locale subfolders** — optional `($locale)` routes; parsing in `app/lib/i18n.ts`. See [`docs/MARKETS.md`](docs/MARKETS.md).
- **GraphQL** under `app/graphql/{fragments,queries,mutations}`; run codegen after query changes.
- **Cache** public catalog only; never cache cart or customer data (`app/lib/cache.ts`).
- **Consent-gated analytics** — stubs in `app/lib/analytics`; no nonessential scripts before consent.
- **Wireframe-first** — neutral art direction now; final brand/motion/photography later without rewriting commerce.

---

## Documentation

| Doc | Topic |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System design, routes, caching, security |
| [`docs/SHOPIFY_SETUP.md`](docs/SHOPIFY_SETUP.md) | Admin metafields, metaobjects, menus, blog |
| [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) | Field semantics and ownership |
| [`docs/MARKETS.md`](docs/MARKETS.md) | Locale URLs and MarketSelector |
| [`docs/SEO_STRATEGY.md`](docs/SEO_STRATEGY.md) | Titles, canonicals, structured data, crawl |
| [`docs/SEO_CHECKLIST.md`](docs/SEO_CHECKLIST.md) | Launch / release SEO checklist |
| [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md) | Budgets and measurement |
| [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) | WCAG expectations and patterns |
| [`docs/ANALYTICS.md`](docs/ANALYTICS.md) | Events, consent, providers |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Oxygen link, env, deploy |
| [`ROADMAP.md`](ROADMAP.md) | Phased delivery plan |

Upstream: [Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen) · [React Router](https://reactrouter.com/)
