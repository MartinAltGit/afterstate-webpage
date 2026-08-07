/**
 * Customer privacy / consent stubs.
 * Compatible shape for later Shopify Customer Privacy API wiring
 * (`window.Shopify.customerPrivacy`).
 */

export type ConsentCategory =
  | 'analytics'
  | 'marketing'
  | 'preferences'
  | 'sale_of_data';

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  saleOfData: boolean;
};

const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  marketing: false,
  preferences: false,
  saleOfData: false,
};

let cachedConsent: ConsentState = {...DEFAULT_CONSENT};
const waiters: Array<(state: ConsentState) => void> = [];

/**
 * Read current consent. Stub returns cached / default (all denied)
 * until Shopify customer privacy is integrated.
 */
export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') {
    return {...DEFAULT_CONSENT};
  }

  const shopifyPrivacy = (
    window as Window & {
      Shopify?: {
        customerPrivacy?: {
          analyticsProcessingAllowed?: () => boolean;
          marketingAllowed?: () => boolean;
          preferencesProcessingAllowed?: () => boolean;
          saleOfDataAllowed?: () => boolean;
        };
      };
    }
  ).Shopify?.customerPrivacy;

  if (shopifyPrivacy) {
    cachedConsent = {
      analytics: Boolean(shopifyPrivacy.analyticsProcessingAllowed?.()),
      marketing: Boolean(shopifyPrivacy.marketingAllowed?.()),
      preferences: Boolean(shopifyPrivacy.preferencesProcessingAllowed?.()),
      saleOfData: Boolean(shopifyPrivacy.saleOfDataAllowed?.()),
    };
  }

  return {...cachedConsent};
}

/**
 * Whether a specific consent category is granted.
 */
export function hasConsent(category: ConsentCategory = 'analytics'): boolean {
  const state = getConsentState();
  switch (category) {
    case 'analytics':
      return state.analytics;
    case 'marketing':
      return state.marketing;
    case 'preferences':
      return state.preferences;
    case 'sale_of_data':
      return state.saleOfData;
    default:
      return false;
  }
}

/**
 * Convenience for analytics gating.
 */
export function hasAnalyticsConsent(): boolean {
  return hasConsent('analytics');
}

/**
 * Wait until consent is available / resolved.
 * Stub resolves on next microtask with current state; later can listen
 * to Shopify `visitorConsentCollected` / banner events.
 */
export function waitForConsent(
  timeoutMs: number = 3000,
): Promise<ConsentState> {
  if (typeof window === 'undefined') {
    return Promise.resolve({...DEFAULT_CONSENT});
  }

  const immediate = getConsentState();
  // If Shopify API is present, treat current read as resolved.
  const hasApi = Boolean(
    (window as Window & {Shopify?: {customerPrivacy?: unknown}}).Shopify
      ?.customerPrivacy,
  );
  if (hasApi) {
    return Promise.resolve(immediate);
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = (state: ConsentState) => {
      if (settled) return;
      settled = true;
      resolve(state);
    };

    waiters.push(finish);

    // Stub: resolve shortly with current defaults so callers don't hang.
    const timer = window.setTimeout(() => {
      finish(getConsentState());
    }, Math.min(timeoutMs, 50));

    // Allow manual unlock from future banner integration.
    void timer;
  });
}

/**
 * Test / future banner helper — update local consent cache and flush waiters.
 * Not for production use until privacy banner is wired.
 */
export function __setConsentStateForTests(next: Partial<ConsentState>): void {
  cachedConsent = {...cachedConsent, ...next};
  while (waiters.length) {
    const waiter = waiters.shift();
    waiter?.(getConsentState());
  }
}
