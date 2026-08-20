# Deployment — Afterstate

Deploy the Hydrogen storefront to **Shopify Oxygen**. Shopify remains checkout, Admin, and data plane; Oxygen runs this app.

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`README.md`](../README.md)

---

## Prerequisites

- Shopify partner / store access with Oxygen enabled for the storefront
- Node 22 or 24 locally
- Project dependency `@shopify/cli` (use `npx shopify …`)
- App builds locally: `npm run build`

---

## One-time: link storefront

From the project root:

```bash
npx shopify hydrogen link
```

Select the shop and Hydrogen storefront. This connects the local repo to Oxygen / store env.

Verify with Hydrogen CLI status commands if unsure which storefront is linked.

---

## Environment variables

### Pull to local

```bash
npx shopify hydrogen env pull
```

Writes / updates `.env` from the linked Oxygen storefront. **Do not commit `.env`.**

### Required / expected keys

| Variable | Notes |
| --- | --- |
| `SESSION_SECRET` | Required at runtime |
| `PUBLIC_STORE_DOMAIN` | `*.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | Public Storefront token |
| `PRIVATE_STOREFRONT_API_TOKEN` | Server token |
| `PUBLIC_STOREFRONT_ID` | Analytics |
| `PUBLIC_CHECKOUT_DOMAIN` | Checkout + consent |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | Account |
| `PUBLIC_CUSTOMER_ACCOUNT_API_URL` | Account |
| `PUBLIC_SITE_URL` | Production canonical origin (set for prod) |
| `STOREFRONT_PASSWORD` | Optional temporary storefront lock. Set to require a password; remove to open the store. Server-only — do not prefix with `PUBLIC_`. |

Set / rotate secrets in the Oxygen / Hydrogen storefront environment UI as well as locally. Preview and production should differ where needed (`PUBLIC_SITE_URL`, indexing behavior).

---

## Deploy

```bash
npm run typecheck
npm run lint
npm run build
npx shopify hydrogen deploy
```

`shopify hydrogen deploy` uploads the Oxygen worker build and creates a deployment (production or as prompted by CLI flags / linking).

Useful variants (confirm current CLI help):

```bash
npx shopify hydrogen deploy --help
```

Typical options include choosing environment / production vs preview depending on CLI version.

### Preview vs production

| | Preview | Production |
| --- | --- | --- |
| Indexing | **noindex** | indexable when ready |
| `PUBLIC_SITE_URL` | Preview host or unset | Real domain origin |
| Data | Often same shop; careful with real inventory | Live Markets + catalog |
| Auth | May use shared Customer Account config | Production redirect URLs |

---

## Custom domain

1. Complete an Oxygen production deployment
2. Attach domain in Shopify Admin / Oxygen storefront domain settings
3. Configure DNS as instructed (usually CNAME / A records per Shopify docs)
4. Set `PUBLIC_SITE_URL` to `https://your-domain`
5. Re-deploy or update env so canonicals and OG URLs use the public origin
6. Verify TLS and redirect apex ↔ www policy (single canonical host)

---

## Customer Account on deployed hosts

Production and stable preview URLs must be allowlisted for Customer Account API / OAuth redirect URLs in the Headless / Customer Account configuration. Local tunnel domains are separate from Oxygen URLs — update both when environments change.

---

## Post-deploy verification

- [ ] Home, shop, PDP, cart load on the deployment URL
- [ ] Add to cart → checkout handoff to Shopify
- [ ] `robots.txt` and `sitemap.xml` respond
- [ ] Preview is `noindex`; production is intentional
- [ ] Locale prefix market URLs resolve
- [ ] Env secrets present (no boot error on `SESSION_SECRET`)
- [ ] Consent / analytics stubs behave as expected for the environment

---

## Rollback

Oxygen keeps prior deployments. Use the Shopify Admin / Oxygen deployment UI (or CLI) to activate a previous successful deployment if a release fails. Keep the last-known-good deployment ID in the launch notes.

---

## CI recommendations

When CI is added:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. Optional: Playwright smoke against preview URL
6. Deploy via authenticated `shopify hydrogen deploy` only from protected branches

Never print env secrets in CI logs.

---

## Mock.shop vs linked deploy

- Local Mock.shop is fine for UI without a shop link
- Oxygen deployments expect a **linked** storefront and real Storefront API tokens
- Metafields / metaobjects require Admin setup on that shop ([`SHOPIFY_SETUP.md`](./SHOPIFY_SETUP.md))

---

## References

- [Hydrogen deployment](https://shopify.dev/docs/storefronts/headless/hydrogen/deploy)
- [Oxygen](https://shopify.dev/docs/storefronts/headless/hydrogen/oxygen)
- [Environment variables](https://shopify.dev/docs/storefronts/headless/hydrogen/environments)
