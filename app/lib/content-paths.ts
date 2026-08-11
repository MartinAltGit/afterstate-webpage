/** Shopify blog handle for brand Journal essays. */
export const JOURNAL_BLOG_HANDLE = 'journal';

/** Shopify blog handle for fashion-world Blog posts (trends, stories, culture). */
export const FASHION_BLOG_HANDLE = 'blog';

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
