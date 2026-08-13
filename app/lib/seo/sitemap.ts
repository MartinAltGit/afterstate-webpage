import {
  blogIndexPath,
  COLLECTION_HANDLE_REDIRECTS,
  PAGE_HANDLE_PATHS,
} from '~/lib/content-paths';
import {buildCanonicalUrl} from './url';
import {SEO_MARKETS} from './markets';

/** Indexable Hydrogen routes that Shopify's catalog sitemap does not list. */
export const STATIC_SITEMAP_PATHS = [
  '/',
  '/shop',
  '/collections',
  '/blog',
  '/journal',
  '/journal/essays',
  '/afterstate-001-no-rush',
  '/about',
  '/philosophy',
  '/care',
  '/size-guide',
  '/shipping-returns',
  '/contact',
  '/copyright',
] as const;

function localePrefix(locale?: string): string {
  if (!locale || locale.toUpperCase() === 'EN-EU') return '';
  return `/${locale.toLowerCase()}`;
}

/**
 * Map Hydrogen sitemap resource types onto Afterstate storefront paths.
 */
export function sitemapResourcePath(
  type: string,
  handle?: string,
): string | null {
  if (!handle) return null;
  const kind = type.toLowerCase();
  const slug = handle.replace(/^\/+|\/+$/g, '');

  if (kind === 'products' || kind === 'product') {
    return `/products/${slug}`;
  }

  if (kind === 'collections' || kind === 'collection') {
    return COLLECTION_HANDLE_REDIRECTS[slug.toLowerCase()] ?? `/collections/${slug}`;
  }

  if (kind === 'pages' || kind === 'page') {
    return PAGE_HANDLE_PATHS[slug.toLowerCase()] ?? `/pages/${slug}`;
  }

  if (kind === 'blogs' || kind === 'blog') {
    return blogIndexPath(slug);
  }

  if (kind === 'articles' || kind === 'article') {
    const [blogHandle, articleHandle] = slug.includes('/')
      ? slug.split('/')
      : [undefined, slug];
    if (blogHandle && articleHandle) {
      const index = blogIndexPath(blogHandle);
      return `${index}/${articleHandle}`;
    }
    return `/blog/${slug}`;
  }

  return `/${kind}/${slug}`;
}

export function sitemapAbsoluteUrl(options: {
  type: string;
  baseUrl: string;
  handle?: string;
  locale?: string;
}): string {
  const path = sitemapResourcePath(options.type, options.handle) ?? '/';
  const prefixed = `${localePrefix(options.locale)}${path === '/' ? '' : path}` || '/';
  return `${options.baseUrl.replace(/\/$/, '')}${prefixed.startsWith('/') ? prefixed : `/${prefixed}`}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * urlset for Hydrogen-only pages (home, shop, journal, campaign, …).
 */
export function buildStaticSitemapXml(origin: string): string {
  const urls = STATIC_SITEMAP_PATHS.map((path) => {
    const loc = buildCanonicalUrl(origin, path);
    const alternates = SEO_MARKETS.map((market) => {
      const href = buildCanonicalUrl(
        origin,
        market.pathPrefix ? `${market.pathPrefix}${path === '/' ? '' : path}` : path,
      );
      return `    <xhtml:link rel="alternate" hreflang="${escapeXml(market.hreflang)}" href="${escapeXml(href)}" />`;
    }).join('\n');

    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
${alternates}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}
