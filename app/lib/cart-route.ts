import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';

/**
 * Locale-prefixed cart action path for CartForm / fetcher submits.
 * Bare `/cart` would run under the default market (EN-EU / NL).
 */
export function useCartRoute(): string {
  const localePrefix = useLocalePathPrefix();
  return prefixPathWithLocale('/cart', localePrefix);
}
