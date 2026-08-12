# Markets

Afterstate uses Shopify Markets with **locale subfolder** URLs. There is no silent geo-redirect that hides market choice from the buyer.

## URL shape

| Market | Path prefix | Country context | Typical currency |
| --- | --- | --- | --- |
| Default (EN-EU) | _(none)_ | `NL` | EUR |
| EN-GB | `/en-gb` | `GB` | GBP |
| DE-DE | `/de-de` | `DE` | EUR |
| FR-FR | `/fr-fr` | `FR` | EUR |

Europe-only: there is no US market. Unknown locale prefixes (including `/en-us`) 404.  
`/en-eu` (and `/en-nl`) **301** to the unprefixed default-market URL so one canonical surface exists for EN-EU.

- Locale segment format: `/{lang}-{country}/…` (lowercase in URLs).
- Parsing: `getLocaleFromRequest` in `app/lib/i18n.ts` sets Hydrogen `i18n` (`language`, `country`, `pathPrefix`).
- `EU` is not a Storefront `CountryCode` — default English Europe maps to `NL` for euro pricing.
- Route layout: optional `($locale)` param; invalid locales 404 via `($locale).tsx`.
- Path helpers: `prefixPathWithLocale` / `replaceLocaleInPath` in `app/lib/locale-path.ts`, plus `useLocalePathPrefix` in `app/lib/locale.ts`.
- New carts receive `buyerIdentity.countryCode` from the active market; `CartBuyerIdentitySync` updates existing carts when the locale changes.
- Document SEO: root `meta` emits absolute `canonical` + `hreflang` (via `PUBLIC_SITE_URL` / `buildDocumentSeoMeta`).

Storefront queries run `@inContext(country, language)` from that i18n context so catalog, currency, and translated resources match the market.

## MarketSelector

`MarketSelector` (`app/components/commerce/MarketSelector.tsx`) is the manual market switcher in layout (header/footer via `PageLayout`).

- Swaps only the locale prefix on the **current path** (query string preserved).
- Does not auto-detect country or force a market.
- Default market list: `AFTERSTATE_MARKETS` (`EN-EU`, `EN-GB`, `DE-DE`, `FR-FR`).
- Active market is matched by **path prefix** (not language code), so EN-GB stays reachable alongside EU.
- UI codes: `EU` / `GB` / `DE` / `FR`.
- Emits `hreflang`-friendly labels for links; canonical / alternate SEO tags are handled in the SEO layer separately.

## Content expectations

- English-first at launch; other markets may show the same English copy until translations exist in Shopify.
- Shipping, duties, and policy differences stay in Shopify Markets + policy routes — not hard-coded per locale in Hydrogen.
- Prefer Admin URL redirects for legacy `/pages/…` and `/blogs/journal/…` aliases; app loaders also redirect journal blog paths to `/journal`.

## Admin checklist for EUR

1. Enable a European market with **EUR** (or set store currency to EUR).
2. Confirm product prices resolve to `EUR` on `/` (default) in the storefront.
3. Confirm `/en-gb` still shows `GBP` if you sell in the UK.
