import {prefixPathWithLocale} from '~/lib/locale-path';
import type {AlternateLanguage} from './url';

/**
 * Published Europe markets for hreflang / sitemap alternates.
 * Default EN-EU is unprefixed (`/`); hreflang is `en` (not `en-EU`).
 */
export type SeoMarket = {
  label: string;
  pathPrefix: string;
  /** BCP 47 hreflang value */
  hreflang: string;
  /** Preferred URL for this market (empty = site root paths) */
  isDefault?: boolean;
};

export const SEO_MARKETS: readonly SeoMarket[] = [
  {label: 'EN-EU', pathPrefix: '', hreflang: 'en', isDefault: true},
  {label: 'EN-GB', pathPrefix: '/en-gb', hreflang: 'en-GB'},
  {label: 'DE-DE', pathPrefix: '/de-de', hreflang: 'de-DE'},
  {label: 'FR-FR', pathPrefix: '/fr-fr', hreflang: 'fr-FR'},
] as const;

/** Collapse duplicate default-market prefixes to the canonical unprefixed form. */
export function preferredPathPrefix(pathPrefix: string): string {
  const normalized = pathPrefix.toLowerCase();
  if (!normalized || normalized === '/en-eu') return '';
  return pathPrefix.startsWith('/')
    ? pathPrefix.toLowerCase()
    : `/${normalized}`;
}

/**
 * Locale-agnostic path (`/products/tee`) from a possibly prefixed pathname.
 */
export function toLocaleAgnosticPath(pathname: string): string {
  const raw = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const match = raw.match(/^\/([a-z]{2}-[a-z]{2})(?=\/|$)/i);
  if (!match) return raw || '/';
  const rest = raw.slice(match[0].length);
  if (!rest) return '/';
  return rest.startsWith('/') ? rest : `/${rest}`;
}

/**
 * Path for the current market’s preferred URL shape.
 */
export function buildMarketPath(
  localeAgnosticPath: string,
  pathPrefix: string,
): string {
  return prefixPathWithLocale(
    localeAgnosticPath || '/',
    preferredPathPrefix(pathPrefix),
  );
}

/**
 * hreflang alternates for all published markets + x-default → EN-EU.
 */
export function buildHreflangAlternates(
  origin: string,
  localeAgnosticPath: string,
  buildAbsolute: (origin: string, path: string) => string,
): AlternateLanguage[] {
  const path = localeAgnosticPath || '/';
  const alternates: AlternateLanguage[] = SEO_MARKETS.map((market) => ({
    hreflang: market.hreflang,
    href: buildAbsolute(
      origin,
      prefixPathWithLocale(path, market.pathPrefix),
    ),
  }));

  const defaultMarket = SEO_MARKETS.find((m) => m.isDefault) ?? SEO_MARKETS[0];
  alternates.push({
    hreflang: 'x-default',
    href: buildAbsolute(
      origin,
      prefixPathWithLocale(path, defaultMarket.pathPrefix),
    ),
  });

  return alternates;
}

/** HTML `lang` from Hydrogen language code (EN → en). */
export function htmlLangFromLanguage(language?: string | null): string {
  if (!language) return 'en';
  return language.toLowerCase().slice(0, 2);
}
