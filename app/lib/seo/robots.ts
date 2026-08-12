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
 * Compare against locale-agnostic paths (no `/en-gb` prefix).
 */
export const DEFAULT_NOINDEX_PATH_PREFIXES = [
  '/cart',
  '/account',
  '/discount',
  '/search',
  '/orders',
  '/subscribe',
] as const;

export function pathSuggestsNoIndex(pathname: string): boolean {
  return robotsPolicyForPath(pathname).noindex;
}

export type PathRobotsPolicy = {
  noindex: boolean;
  nofollow: boolean;
};

/**
 * Robots policy for a locale-agnostic pathname.
 * Cart/account/discount: noindex,nofollow
 * Search: noindex,follow (allow equity to flow to results targets)
 */
export function robotsPolicyForPath(pathname: string): PathRobotsPolicy {
  const path = normalizeAgnosticPath(pathname);

  if (
    path === '/cart' ||
    path.startsWith('/cart/') ||
    path === '/account' ||
    path.startsWith('/account/') ||
    path === '/discount' ||
    path.startsWith('/discount/') ||
    path === '/orders' ||
    path.startsWith('/orders/') ||
    path === '/subscribe' ||
    path.startsWith('/subscribe/')
  ) {
    return {noindex: true, nofollow: true};
  }

  if (path === '/search' || path.startsWith('/search/')) {
    return {noindex: true, nofollow: false};
  }

  return {noindex: false, nofollow: false};
}

function normalizeAgnosticPath(pathname: string): string {
  const raw = pathname.toLowerCase();
  const match = raw.match(/^\/([a-z]{2}-[a-z]{2})(?=\/|$)/);
  if (!match) return raw.startsWith('/') ? raw : `/${raw}`;
  const rest = raw.slice(match[0].length);
  if (!rest) return '/';
  return rest.startsWith('/') ? rest : `/${rest}`;
}
