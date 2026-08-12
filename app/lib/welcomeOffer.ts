import {getLocalePathPrefix} from '~/lib/locale';

/**
 * Welcome discount shown in the site announcement bar.
 * Must exist as a code discount in Shopify Admin (docs/SHOPIFY_SETUP.md).
 * While testing: create Welcome20 at 20% with open eligibility.
 * Before launch: add once-per-customer + first-time buyer limits in Admin.
 */
export const WELCOME_DISCOUNT_CODE = 'Welcome20';

export const WELCOME_DISCOUNT_LABEL = '20% off your first order';

/** Fraction used for cart UI preview when Shopify hasn’t allocated the code yet. */
export const WELCOME_DISCOUNT_PERCENT = 0.2;

export function isWelcomeDiscountCode(code: string) {
  return code.toLowerCase() === WELCOME_DISCOUNT_CODE.toLowerCase();
}

/**
 * Home and shop only (locale prefixes stripped). Desktop and mobile share this.
 */
export function isWelcomeOfferPath(pathname: string) {
  const prefix = getLocalePathPrefix(pathname);
  let path = prefix ? pathname.slice(prefix.length) || '/' : pathname;
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.replace(/\/+$/, '') || '/';
  return path === '/' || path === '/shop';
}
