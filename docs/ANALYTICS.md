# Analytics — Afterstate

Consent-first measurement for the Hydrogen storefront. Implementation stubs: `app/lib/analytics`, `app/lib/consent`.

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## Principles

1. **No nonessential tracking before consent** (Shopify Customer Privacy / regional requirements)
2. Keep the analytics adapter **replaceable** (`track()` in `app/lib/analytics`)
3. Prefer **Shopify-native** analytics + storefront pixel paths; add GTM only if required
4. Never put PII in event payloads (emails, addresses, raw order dumps)
5. Preview / local: debug logging only; do not pollute production properties

---

## Consent

- Use Hydrogen + Shopify Customer Privacy (2026.4 consent / backend consent mode)
- `hasAnalyticsConsent()` gates `track()` — if false, **no-op**
- Marketing / analytics cookies and scripts load only after allow
- Checkout domain (`PUBLIC_CHECKOUT_DOMAIN`) participates in consent configuration
- Document the banner UX when implemented (accept / decline / manage)

Until the banner is wired, assume analytics must stay stubbed or strictly essential.

---

## Event catalog

Constants: `AnalyticsEvents` in `app/lib/analytics/events.ts`.

| Event | When | Suggested payload (non-PII) |
| --- | --- | --- |
| `page_view` | Route commit / page display | `path`, `locale`, `title` |
| `product_view` | PDP loader / view | `productId`, `handle`, `variantId?` |
| `product_list_view` | Collection / shop grid | `collectionHandle?`, `itemCount` |
| `collection_view` | Collection page | `handle` |
| `search` | Search submit / results | `query` (truncated if needed), `resultCount` |
| `add_to_cart` | Line add success | `productId`, `variantId`, `quantity` |
| `remove_from_cart` | Line remove | `productId`, `variantId`, `quantity` |
| `begin_checkout` | Checkout redirect / click | `cartId?`, `lineCount`, `value?`, `currency?` |
| `newsletter_subscribe` | Successful subscribe | `source` (e.g. footer) |
| `cta_click` | Key marketing CTAs | `label`, `href` |

Also track (when implemented):

- **Purchase** — via Shopify / checkout thank-you or web pixel (Hydrogen may not own the thank-you page)
- **Market change** — from `MarketSelector` (`from`, `to` locale)

Do not invent parallel event names per vendor; map in the adapter layer.

---

## Providers

| Provider | Role | Status |
| --- | --- | --- |
| Shopify Analytics / Customer Privacy | Baseline storefront + consent | Wire with Hydrogen analytics components |
| Storefront / web pixels (Admin) | Purchase and platform events | Configure in Shopify Admin |
| GTM / GA4 (optional) | Extra marketing stack | Only if brand requires; consent-gated |
| Console debug stub | Local / until live | Current `track()` behavior |

Replace the stub body of `track()` with the chosen SDK calls; keep the function signature stable so call sites do not churn.

---

## Hydrogen wiring notes

- Root already passes storefront id / checkout domain into analytics-related config (`app/root.tsx`, `entry.server.tsx`)
- Use Hydrogen `<Analytics.*>` patterns where they align with React Router 7 + Hydrogen 2026.4
- Cart and product events should fire **after** successful mutations, not on intent alone
- Search: fire on committed query, not every predictive keystroke (or debounce heavily)

---

## Environments

| Env | Behavior |
| --- | --- |
| Local / Mock.shop | `console.debug` stub acceptable |
| Preview Oxygen | Prefer disabled or separate debug property; still respect consent |
| Production | Live property; consent required |

`PUBLIC_STOREFRONT_ID` must be set for Shopify analytics identification.

---

## QA checklist

- [ ] Decline consent → no analytics network calls / tags
- [ ] Accept consent → page_view + product_view fire once per navigation
- [ ] Add to cart / remove fire with correct variant ids
- [ ] Begin checkout fires before leaving to Shopify Checkout
- [ ] Purchase visible in Shopify analytics / pixels after test order
- [ ] Market switch event (if implemented) does not double-count page_view incorrectly
- [ ] No email or address fields in custom payloads

---

## Privacy / legal

- Link cookie / privacy policy from consent UI and footer
- Align retention and processors with Shopify Plus/store policy docs
- Regional Markets may imply different consent defaults — verify for each launch market

---

## Out of scope

- Building a custom data warehouse in this repo
- Server-side forwarding of raw customer PII
- Heatmap tools that record form fields without explicit review
