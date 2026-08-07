import {hasAnalyticsConsent} from '~/lib/consent/privacy';

/**
 * Afterstate analytics event name constants.
 * Wire to Shopify Customer Privacy + provider SDKs later.
 */
export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  PRODUCT_LIST_VIEW: 'product_list_view',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
  COLLECTION_VIEW: 'collection_view',
  SEARCH: 'search',
  CTA_CLICK: 'cta_click',
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsPayload = Record<string, unknown>;

/**
 * Consent-gated analytics track stub.
 * No-ops when analytics consent has not been granted.
 */
export function track(
  event: AnalyticsEventName | string,
  payload: AnalyticsPayload = {},
): void {
  if (!hasAnalyticsConsent()) return;

  // Stub: replace with Shopify Analytics / GTM / custom collector.
  void event;
  void payload;
}

/**
 * Fire a page view when consent allows.
 */
export function trackPageView(payload: AnalyticsPayload = {}): void {
  track(AnalyticsEvents.PAGE_VIEW, payload);
}
