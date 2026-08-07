# Markets

Afterstate uses Shopify Markets with **locale subfolder** URLs. There is no silent geo-redirect that hides market choice from the buyer.

## URL shape

| Market | Path prefix | Example |
| --- | --- | --- |
| Default (EN-US) | _(none)_ | `/products/tee` |
| EN-GB | `/en-gb` | `/en-gb/products/tee` |
| EN-EU | `/en-eu` | `/en-eu/collections/afterstate-001` |
| DE-DE | `/de-de` | `/de-de/journal` |
| FR-FR | `/fr-fr` | `/fr-fr/about` |

- Locale segment format: `/{lang}-{country}/…` (lowercase in URLs).
- Parsing: `getLocaleFromRequest` in `app/lib/i18n.ts` sets Hydrogen `i18n` (`language`, `country`, `pathPrefix`).
- Route layout: optional `($locale)` param; invalid locales 404 via `($locale).tsx`.
- Path helpers: `prefixPathWithLocale` / `replaceLocaleInPath` in `app/lib/locale-path.ts`, plus `useLocalePathPrefix` in `app/lib/locale.ts`.

Storefront queries run `@inContext(country, language)` from that i18n context so catalog, currency, and translated resources match the market.

## MarketSelector

`MarketSelector` (`app/components/commerce/MarketSelector.tsx`) is the manual market switcher in layout (header/footer via `PageLayout`).

- Swaps only the locale prefix on the **current path** (query string preserved).
- Does not auto-detect country or force a market.
- Default market list: `AFTERSTATE_MARKETS` (`EN-US`, `EN-GB`, `EN-EU`, `DE-DE`, `FR-FR`).
- Emits `hreflang`-friendly labels for links; canonical / alternate SEO tags are handled in the SEO layer separately.

## Content expectations

- English-first at launch; other markets may show the same English copy until translations exist in Shopify.
- Shipping, duties, and policy differences stay in Shopify Markets + policy routes — not hard-coded per locale in Hydrogen.
- Prefer Admin URL redirects for legacy `/pages/…` and `/blogs/journal/…` aliases; app loaders also redirect journal blog paths to `/journal`.
