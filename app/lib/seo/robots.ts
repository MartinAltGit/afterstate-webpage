/**
 * Helpers for robots / noindex decisions.
 */

export type RobotsDecisionInput = {
  /** Explicit override from CMS or route */
  noindex?: boolean | null;
  /** Draft / unpublished content */
  isDraft?: boolean;
  /** Password-protected or private pages */
  isPrivate?: boolean;
  /** Search result / filter pages that should not be indexed */
  isFacetedSearch?: boolean;
  /** Cart, account, checkout-adjacent surfaces */
  isTransactional?: boolean;
  /** Preview / staging hosts */
  isPreviewEnvironment?: boolean;
};

/**
 * Decide whether a page should send noindex.
 */
export function shouldNoIndex(input: RobotsDecisionInput = {}): boolean {
  if (input.noindex === true) return true;
  if (input.noindex === false) return false;
  if (input.isDraft) return true;
  if (input.isPrivate) return true;
  if (input.isFacetedSearch) return true;
  if (input.isTransactional) return true;
  if (input.isPreviewEnvironment) return true;
  return false;
}

/**
 * Build a robots meta content string.
 */
export function buildRobotsDirective(opts: {
  noindex?: boolean;
  nofollow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
} = {}): string {
  const directives: string[] = [];
  directives.push(opts.noindex ? 'noindex' : 'index');
  directives.push(opts.nofollow ? 'nofollow' : 'follow');
  if (opts.noarchive) directives.push('noarchive');
  if (opts.nosnippet) directives.push('nosnippet');
  return directives.join(', ');
}

/**
 * Paths that should typically be noindexed on an Afterstate storefront.
 */
export const DEFAULT_NOINDEX_PATH_PREFIXES = [
  '/cart',
  '/account',
  '/discount',
  '/search',
] as const;

export function pathSuggestsNoIndex(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return DEFAULT_NOINDEX_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
