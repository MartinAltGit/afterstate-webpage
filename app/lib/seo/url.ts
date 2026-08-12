export type AlternateLanguage = {
  /** BCP 47 / hreflang value, e.g. `en-GB` or `x-default` */
  hreflang: string;
  href: string;
};

/**
 * Normalize a path to an absolute URL against a site origin.
 */
export function buildCanonicalUrl(
  origin: string,
  path: string = '/',
): string {
  const base = origin.replace(/\/$/, '');
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return `${base}/`;
  return `${base}${normalized.replace(/\/$/, '')}`;
}

/**
 * Strip tracking query params commonly used in campaign links.
 */
export function stripTrackingParams(url: string): string {
  try {
    const parsed = new URL(url);
    const strip = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
    ];
    for (const key of strip) {
      parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
