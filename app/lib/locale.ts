import {useLocation} from 'react-router';
import {prefixPathWithLocale as applyLocalePrefix} from '~/lib/locale-path';

/** Matches a Hydrogen market path segment like `/en-us` or `/sv-se`. */
const LOCALE_SEGMENT = /^\/([a-z]{2}-[a-z]{2})(?=\/|$)/i;

/**
 * Extract the locale path prefix from a pathname (e.g. `/en-us` or ``).
 */
export function getLocalePathPrefix(pathname: string): string {
  const match = pathname.match(LOCALE_SEGMENT);
  return match ? `/${match[1].toLowerCase()}` : '';
}

/**
 * Prefix an absolute path with a locale segment when present.
 * Paths that are already locale-prefixed, relative, or external are unchanged.
 */
export function prefixPathWithLocale(path: string, localePrefix: string): string {
  if (!path.startsWith('/')) return path;
  if (!localePrefix) return path;

  const lower = path.toLowerCase();
  const prefix = localePrefix.toLowerCase();

  if (lower === prefix || lower.startsWith(`${prefix}/`)) {
    return path;
  }

  if (LOCALE_SEGMENT.test(path)) return path;

  return applyLocalePrefix(path, localePrefix);
}

/**
 * Current locale path prefix derived from the active location.
 */
export function useLocalePathPrefix(): string {
  const {pathname} = useLocation();
  return getLocalePathPrefix(pathname);
}

/**
 * Prefix an absolute path with the active locale segment when present.
 */
export function usePrefixPathWithLocale(path: string): string {
  const prefix = useLocalePathPrefix();
  return prefixPathWithLocale(path, prefix);
}
