/**
 * Hydrogen Storefront API cache strategies for Afterstate.
 *
 * Pass these via `storefront.query(QUERY, { cache: storefront.CacheShort() })`.
 * Only use shared caches for public catalog / CMS data — never for cart or customer.
 *
 * @see https://shopify.dev/docs/api/hydrogen/latest/utilities/createwithcache
 * @see https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/cache
 */

/**
 * Cache strategy reference (use from `context.storefront` in loaders):
 *
 * | Helper | Typical use | Notes |
 * | --- | --- | --- |
 * | `storefront.CacheShort()` | Homepage sections, search results, campaign metaobjects, fashion blog | Short TTL; revalidates quickly after publish |
 * | `storefront.CacheLong()` | Menus, shop brand, policies, stable collections | Longer TTL for rarely changing public data |
 * | `storefront.CacheNone()` | Predictive search, highly dynamic public queries | No shared cache |
 * | `storefront.CacheCustom({...})` | Tuned maxAge / staleWhileRevalidate | Prefer named helpers when possible |
 *
 * Never cache:
 * - Cart queries / mutations
 * - Customer Account API (orders, profile, addresses)
 * - Buyer-specific pricing that must stay private
 *
 * Examples:
 *
 * ```ts
 * // Catalog / collection (public)
 * await storefront.query(COLLECTION_QUERY, {
 *   variables: { handle },
 *   cache: storefront.CacheShort(),
 * });
 *
 * // Header menus (stable public)
 * await storefront.query(HEADER_QUERY, {
 *   variables: { headerMenuHandle },
 *   cache: storefront.CacheLong(),
 * });
 *
 * // Homepage metaobjects (public, editorial)
 * await storefront.query(HOMEPAGE_SECTIONS_QUERY, {
 *   cache: storefront.CacheShort(),
 * }).catch(() => null); // mock.shop may lack metaobjects
 *
 * // Predictive search
 * await storefront.query(PREDICTIVE_SEARCH_QUERY, {
 *   variables: { searchTerm, limit, limitScope },
 *   cache: storefront.CacheNone(),
 * });
 * ```
 */

/** Documented mapping used by route loaders (names only — call via storefront). */
export const CACHE_STRATEGY = {
  /** Products, collections, homepage, campaigns, journal lists, fashion blog */
  catalog: 'CacheShort',
  /** Menus, shop, policies */
  navigation: 'CacheLong',
  /** Predictive / live search */
  searchLive: 'CacheNone',
  /** Regular search results page */
  searchResults: 'CacheShort',
  /** Cart + customer — do not use storefront shared cache */
  private: 'none',
} as const;

export type CacheStrategyKey = keyof typeof CACHE_STRATEGY;
