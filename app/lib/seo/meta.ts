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
};

const DEFAULT_SITE_NAME = 'Afterstate';
const DEFAULT_TITLE_SEPARATOR = ' — ';

/**
 * Build a page title with optional site name suffix.
 */
export function buildPageTitle(
  title?: string | null,
  siteName: string = DEFAULT_SITE_NAME,
  separator: string = DEFAULT_TITLE_SEPARATOR,
): string {
  const trimmed = title?.trim();
  if (!trimmed) return siteName;
  if (trimmed === siteName) return siteName;
  if (trimmed.endsWith(siteName)) return trimmed;
  return `${trimmed}${separator}${siteName}`;
}

/**
 * Build React Router / Hydrogen-compatible meta descriptors.
 */
export function buildMetaTags(input: SeoMetaInput = {}): MetaDescriptor[] {
  const siteName = input.siteName ?? DEFAULT_SITE_NAME;
  const title = buildPageTitle(input.title, siteName);
  const description =
    input.description?.trim() ||
    'Afterstate — life beyond the rush. Clothes made for a slower, clearer pace.';
  const type = input.type ?? 'website';

  const tags: MetaDescriptor[] = [
    {title},
    {name: 'description', content: description},
    {property: 'og:site_name', content: siteName},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: type},
    {name: 'twitter:card', content: input.imageUrl ? 'summary_large_image' : 'summary'},
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
