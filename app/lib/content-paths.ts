/** Shopify blog handle for brand Journal essays. */
export const JOURNAL_BLOG_HANDLE = 'journal';

/** Shopify blog handle for fashion-world Blog posts (trends, stories, culture). */
export const FASHION_BLOG_HANDLE = 'blog';

/** Journal world hub. */
export const JOURNAL_PATH = '/journal';

/** Brand essays list — destination of the Journal hub tile. */
export const JOURNAL_ESSAYS_PATH = '/journal/essays';

/** Static `/journal/*` segments that must not be treated as article handles. */
export const JOURNAL_RESERVED_HANDLES = ['essays'] as const;

export function isReservedJournalHandle(handle: string): boolean {
  return (JOURNAL_RESERVED_HANDLES as readonly string[]).includes(handle);
}

/**
 * Canonical storefront path for a Shopify article, based on its blog handle.
 */
export function articlePath(blogHandle: string, articleHandle: string): string {
  const handle = blogHandle.toLowerCase();
  if (handle === JOURNAL_BLOG_HANDLE) {
    return `/journal/${articleHandle}`;
  }
  return `/blog/${articleHandle}`;
}

/**
 * Canonical index path for a Shopify blog handle.
 */
export function blogIndexPath(blogHandle: string): string {
  const handle = blogHandle.toLowerCase();
  if (handle === JOURNAL_BLOG_HANDLE) {
    return '/journal';
  }
  return '/blog';
}
