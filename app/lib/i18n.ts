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

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toLowerCase() ?? '';

  if (/^[a-z]{2}-[a-z]{2}$/i.test(firstPathPart)) {
    const known = LOCALES[firstPathPart];
    if (known) {
      return {
        language: known.language,
        country: known.country,
        pathPrefix: known.pathPrefix,
      };
    }

    // Unknown market (e.g. former /en-us) → default i18n so ($locale) 404s
    return {
      language: DEFAULT_LOCALE.language,
      country: DEFAULT_LOCALE.country,
      pathPrefix: DEFAULT_LOCALE.pathPrefix,
    };
  }

  return {
    language: DEFAULT_LOCALE.language,
    country: DEFAULT_LOCALE.country,
    pathPrefix: DEFAULT_LOCALE.pathPrefix,
  };
}
