import type {MetaDescriptor} from './meta';
import {buildCanonicalUrl, stripTrackingParams} from './url';
import {
  buildHreflangAlternates,
  buildMarketPath,
  preferredPathPrefix,
  toLocaleAgnosticPath,
} from './markets';
import {buildRobotsDirective, robotsPolicyForPath} from './robots';

export type SiteOriginEnv = {
  PUBLIC_SITE_URL?: string;
};

/** Public production host. Canonicals, robots, and sitemaps must use this. */
export const PUBLIC_SITE_HOST = 'afterstate.store';
export const PUBLIC_SITE_ORIGIN = `https://${PUBLIC_SITE_HOST}`;

function parseHttpOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function hostnameOf(origin: string): string {
  try {
    return new URL(origin).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

/**
 * True for the known Oxygen typo `afterstate.storeS` (parsed as `.stores`).
 */
function isPublicHostTypo(hostname: string): boolean {
  return hostname === 'afterstate.stores';
}

/**
 * Production origin for canonicals. Prefers PUBLIC_SITE_URL; falls back to
 * the request origin (local / preview) so SEO tags still resolve absolutely.
 *
 * If the request is already on afterstate.store, that host always wins so a
 * mistyped env value cannot poison robots.txt or canonicals.
 */
export function getSiteOrigin(
  env: SiteOriginEnv,
  request?: Request,
): string {
  const configured = parseHttpOrigin(env.PUBLIC_SITE_URL);
  const fromRequest = request ? new URL(request.url).origin : '';
  const requestHost = fromRequest ? hostnameOf(fromRequest) : '';
  const configuredHost = configured ? hostnameOf(configured) : '';

  if (requestHost === PUBLIC_SITE_HOST) return PUBLIC_SITE_ORIGIN;
  if (configuredHost === PUBLIC_SITE_HOST) return PUBLIC_SITE_ORIGIN;
  if (isPublicHostTypo(configuredHost) || isPublicHostTypo(requestHost)) {
    return PUBLIC_SITE_ORIGIN;
  }
  if (configured) return configured;
  return fromRequest;
}

/**
 * Clone a request onto the canonical site origin so Hydrogen sitemap `loc`
 * values match robots.txt and document canonicals.
 */
export function requestWithSiteOrigin(
  request: Request,
  env: SiteOriginEnv,
): Request {
  const origin = getSiteOrigin(env, request);
  if (!origin) return request;
  const current = new URL(request.url);
  const next = new URL(`${current.pathname}${current.search}`, origin);
  if (next.href === current.href) return request;
  return new Request(next, request);
}

export type DocumentSeoInput = {
  origin: string;
  pathname: string;
  /** Active Hydrogen path prefix (may be `/en-eu`). */
  pathPrefix?: string;
  search?: string;
  /** Force robots; otherwise derived from path. */
  noindex?: boolean;
  nofollow?: boolean;
  /** Emit hreflang (default: yes when indexable). */
  includeAlternates?: boolean;
};

/**
 * Canonical + hreflang + robots descriptors for the document head.
 * Use from root `meta` so every route inherits correct absolute URLs.
 */
export function buildDocumentSeoMeta(input: DocumentSeoInput): MetaDescriptor[] {
  if (!input.origin) return [];

  const localeAgnostic = toLocaleAgnosticPath(input.pathname);
  const prefix = preferredPathPrefix(input.pathPrefix ?? '');
  const marketPath = buildMarketPath(localeAgnostic, prefix);
  const policy = robotsPolicyForPath(localeAgnostic);

  // Indexable pages canonicalize to the clean market path (no query).
  // Utility / noindex pages may keep a stripped query string.
  let canonical = buildCanonicalUrl(input.origin, marketPath);
  if (policy.noindex && input.search) {
    const withSearch = `${canonical}${input.search.startsWith('?') ? input.search : `?${input.search}`}`;
    canonical = stripTrackingParams(withSearch).replace(/\?$/, '');
  }

  const noindex = input.noindex ?? policy.noindex;
  const nofollow = input.nofollow ?? policy.nofollow;
  const includeAlternates = input.includeAlternates ?? !noindex;

  const tags: MetaDescriptor[] = [
    {rel: 'canonical', href: canonical},
    {property: 'og:url', content: canonical},
  ];

  if (noindex || nofollow) {
    tags.push({
      name: 'robots',
      content: buildRobotsDirective({noindex, nofollow}),
    });
  }

  if (includeAlternates) {
    for (const alt of buildHreflangAlternates(
      input.origin,
      localeAgnostic,
      buildCanonicalUrl,
    )) {
      tags.push({
        rel: 'alternate',
        hrefLang: alt.hreflang,
        href: alt.href,
      });
    }
  }

  return tags;
}
