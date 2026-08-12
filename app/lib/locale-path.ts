const LOCALE_PREFIX_RE = /^\/([a-z]{2}-[a-z]{2})(?=\/|$)/i;

/**
 * Prefix a locale-agnostic path with a market path prefix.
 * Empty `pathPrefix` keeps the default-market path (EN-EU → `/`).
 */
export function prefixPathWithLocale(path: string, pathPrefix: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!pathPrefix) return normalized === '' ? '/' : normalized;

  const prefix = pathPrefix.startsWith('/') ? pathPrefix : `/${pathPrefix}`;
  if (normalized === '/') return prefix;

  return `${prefix}${normalized}`;
}

/**
 * Swap the locale segment in a pathname for another market prefix.
 * `nextPrefix` of `''` returns the default-market path.
 */
export function replaceLocaleInPath(
  pathname: string,
  nextPrefix: string,
): string {
  const withoutLocale = pathname.replace(LOCALE_PREFIX_RE, '') || '/';
  return prefixPathWithLocale(withoutLocale, nextPrefix);
}
