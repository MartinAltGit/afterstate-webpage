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

/**
 * Production origin for canonicals. Prefers PUBLIC_SITE_URL; falls back to
 * the request origin (local / preview) so SEO tags still resolve absolutely.
 */
export function getSiteOrigin(
  env: SiteOriginEnv,
  request?: Request,
): string {
  const configured = env.PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;
  if (request) return new URL(request.url).origin;
  return '';
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
