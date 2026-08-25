import type {I18nBase} from '@shopify/hydrogen';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

type MarketConfig = {
  language: I18nLocale['language'];
  country: I18nLocale['country'];
  pathPrefix: string;
};

/**
 * Default market: English Europe.
 * Shopify has no `EU` CountryCode — Netherlands (`NL`) drives EUR pricing
 * when the Europe market is enabled in Admin (or store currency is EUR).
 */
export const DEFAULT_LOCALE: MarketConfig = {
  language: 'EN',
  country: 'NL',
  pathPrefix: '',
};

/**
 * URL locale → Storefront `@inContext` language/country.
 * Keep path prefixes stable; map pseudo-regions (EU) to real CountryCodes.
 */
const LOCALES: Record<string, MarketConfig> = {
  'en-eu': {language: 'EN', country: 'NL', pathPrefix: '/en-eu'},
  'en-gb': {language: 'EN', country: 'GB', pathPrefix: '/en-gb'},
  'de-de': {language: 'DE', country: 'DE', pathPrefix: '/de-de'},
  'fr-fr': {language: 'FR', country: 'FR', pathPrefix: '/fr-fr'},
  'nl-nl': {language: 'NL', country: 'NL', pathPrefix: '/nl-nl'},
};

export const LOCALE_COOKIE = 'afterstate_locale';

const LOCALE_SEGMENT_RE = /^[a-z]{2}-[a-z]{2}$/;

/**
 * React Router single-fetch uses `/de-de.data` (and `/de-de/_.data`).
 * Strip that suffix before reading the locale segment.
 */
function localeSegmentFromPathname(pathname: string): string {
  const first = pathname.split('/')[1] ?? '';
  return first.replace(/\.data$/i, '').toLowerCase();
}

export function isKnownLocaleSegment(segment: string): boolean {
  return LOCALE_SEGMENT_RE.test(segment) && segment in LOCALES;
}

function localeFromSegment(segment: string): I18nLocale | null {
  const known = LOCALES[segment];
  if (!known) return null;
  return {
    language: known.language,
    country: known.country,
    pathPrefix: known.pathPrefix,
  };
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    if (trimmed.slice(0, eq) !== name) continue;
    return decodeURIComponent(trimmed.slice(eq + 1));
  }
  return null;
}

/** Persist the active market so `/_root.data` (no locale in the URL) stays in DE/FR. */
export function localeCookieHeader(pathPrefix: string): string {
  const key = pathPrefix.replace(/^\//, '').toLowerCase();
  if (!key || !isKnownLocaleSegment(key)) {
    return `${LOCALE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
  return `${LOCALE_COOKIE}=${key}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function persistLocaleCookie(pathPrefix: string) {
  if (typeof document === 'undefined') return;
  document.cookie = localeCookieHeader(pathPrefix);
}

export function localeCookieHeaderFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const isDataRequest = url.pathname.endsWith('.data');
  const segment = localeSegmentFromPathname(url.pathname);
  if (isKnownLocaleSegment(segment)) {
    return localeCookieHeader(`/${segment}`);
  }
  if (!isDataRequest) {
    return localeCookieHeader('');
  }
  return null;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = localeSegmentFromPathname(url.pathname);

  if (LOCALE_SEGMENT_RE.test(firstPathPart)) {
    const fromPath = localeFromSegment(firstPathPart);
    if (fromPath) return fromPath;

    // Unknown market (e.g. former /en-us) → default i18n so ($locale) 404s
    return {
      language: DEFAULT_LOCALE.language,
      country: DEFAULT_LOCALE.country,
      pathPrefix: DEFAULT_LOCALE.pathPrefix,
    };
  }

  // `/_root.data` has no locale segment — keep the market from the last page.
  if (url.pathname.endsWith('.data')) {
    const cookie = readCookie(request, LOCALE_COOKIE)?.toLowerCase();
    if (cookie) {
      const fromCookie = localeFromSegment(cookie);
      if (fromCookie) return fromCookie;
    }
  }

  return {
    language: DEFAULT_LOCALE.language,
    country: DEFAULT_LOCALE.country,
    pathPrefix: DEFAULT_LOCALE.pathPrefix,
  };
}
