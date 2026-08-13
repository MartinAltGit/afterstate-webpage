export type SeoMetaInput = {
  title?: string | null;
  description?: string | null;
  siteName?: string;
  path?: string;
  canonicalUrl?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  nofollow?: boolean;
};

export type MetaDescriptor = {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  tagName?: 'meta' | 'link';
  rel?: string;
  href?: string;
  hrefLang?: string;
};

const DEFAULT_SITE_NAME = 'Afterstate';
const DEFAULT_TITLE_SEPARATOR = ' — ';

/** Full document title, including the site suffix. Google truncates around here. */
export const SEO_TITLE_MAX_LENGTH = 60;

/** Meta description sweet spot before SERP truncation. */
export const SEO_DESCRIPTION_MAX_LENGTH = 160;

export const DEFAULT_SEO_DESCRIPTION =
  'Afterstate — life beyond the rush. Clothes made for a slower, clearer pace.';

/**
 * Trim to `max` at a word/dash boundary. Used for titles and descriptions.
 */
export function clampSeoText(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  if (max < 8) return normalized.slice(0, max);

  const ellipsis = '…';
  const budget = Math.max(4, max - ellipsis.length);
  let slice = normalized.slice(0, budget);
  const breakChars = new Set([' ', '–', '—', '-', ',', ';', ':']);
  const minKeep = Math.floor(budget * 0.55);
  let breakAt = -1;
  for (let i = slice.length - 1; i >= minKeep; i--) {
    if (breakChars.has(slice[i] ?? '')) {
      breakAt = i;
      break;
    }
  }
  if (breakAt > 0) slice = slice.slice(0, breakAt);
  return `${slice.replace(/[\s,.;:–—-]+$/u, '')}${ellipsis}`;
}

function leadWithoutSiteName(
  title: string,
  siteName: string,
  separator: string,
): string {
  const suffix = `${separator}${siteName}`;
  if (title.endsWith(suffix)) {
    return title.slice(0, -suffix.length).replace(/[\s—–-]+$/u, '');
  }
  if (title.endsWith(siteName) && title.length > siteName.length) {
    return title.slice(0, -siteName.length).replace(/[\s—–-]+$/u, '');
  }
  return title;
}

/**
 * Build a page title with optional site name suffix, capped for SERPs.
 */
export function buildPageTitle(
  title?: string | null,
  siteName: string = DEFAULT_SITE_NAME,
  separator: string = DEFAULT_TITLE_SEPARATOR,
): string {
  const trimmed = title?.replace(/\s+/g, ' ').trim() ?? '';
  if (!trimmed || trimmed === siteName) return siteName;

  const suffix = `${separator}${siteName}`;
  const lead = leadWithoutSiteName(trimmed, siteName, separator) || siteName;
  if (lead === siteName) return siteName;

  const composed = `${lead}${suffix}`;
  if (composed.length <= SEO_TITLE_MAX_LENGTH) return composed;

  const maxLead = SEO_TITLE_MAX_LENGTH - suffix.length;
  return `${clampSeoText(lead, maxLead)}${suffix}`;
}

/**
 * Build React Router / Hydrogen-compatible meta descriptors.
 * Document-level canonical / hreflang are owned by root `buildDocumentSeoMeta`.
 */
export function buildMetaTags(input: SeoMetaInput = {}): MetaDescriptor[] {
  const siteName = input.siteName ?? DEFAULT_SITE_NAME;
  const title = buildPageTitle(input.title, siteName);
  const description = clampSeoText(
    input.description?.trim() || DEFAULT_SEO_DESCRIPTION,
    SEO_DESCRIPTION_MAX_LENGTH,
  );
  const type = input.type ?? 'website';

  const tags: MetaDescriptor[] = [
    {title},
    {name: 'description', content: description},
    {property: 'og:site_name', content: siteName},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: type},
    {
      name: 'twitter:card',
      content: input.imageUrl ? 'summary_large_image' : 'summary',
    },
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];

  if (input.canonicalUrl) {
    tags.push({property: 'og:url', content: input.canonicalUrl});
  }

  if (input.imageUrl) {
    tags.push(
      {property: 'og:image', content: input.imageUrl},
      {name: 'twitter:image', content: input.imageUrl},
    );
    if (input.imageAlt) {
      tags.push({property: 'og:image:alt', content: input.imageAlt});
    }
  }

  const robots = buildRobotsContent({
    noindex: input.noindex,
    nofollow: input.nofollow,
  });
  if (robots) {
    tags.push({name: 'robots', content: robots});
  }

  return tags;
}

function buildRobotsContent(opts: {
  noindex?: boolean;
  nofollow?: boolean;
}): string | null {
  if (!opts.noindex && !opts.nofollow) return null;
  const parts: string[] = [];
  parts.push(opts.noindex ? 'noindex' : 'index');
  parts.push(opts.nofollow ? 'nofollow' : 'follow');
  return parts.join(', ');
}
