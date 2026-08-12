import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {useCartRoute} from '~/lib/cart-route';

type CartBuyerIdentitySyncProps = {
  /** Active Hydrogen market country (e.g. NL for EUR). */
  countryCode: string;
  /** Country currently on the cart, if any. */
  cartCountryCode?: string | null;
  /** Only sync when a cart already exists — avoids creating empty carts. */
  hasCart: boolean;
};

/**
 * Keeps cart buyer identity in sync with the URL market so currency converts
 * when the shopper switches locale (e.g. EN-EU ↔ EN-GB).
 */
export function CartBuyerIdentitySync({
  countryCode,
  cartCountryCode,
  hasCart,
}: CartBuyerIdentitySyncProps) {
  const fetcher = useFetcher();
  const cartRoute = useCartRoute();
  const lastSubmitted = useRef<string | null>(null);

  useEffect(() => {
    if (!hasCart || !countryCode) return;
    if (cartCountryCode === countryCode) {
      lastSubmitted.current = countryCode;
      return;
    }
    if (lastSubmitted.current === countryCode) return;
    if (fetcher.state !== 'idle') return;

    lastSubmitted.current = countryCode;

    const formData = new FormData();
    formData.set(
      CartForm.INPUT_NAME,
      JSON.stringify({
        action: CartForm.ACTIONS.BuyerIdentityUpdate,
        inputs: {
          buyerIdentity: {countryCode},
        },
      }),
    );

    fetcher.submit(formData, {method: 'post', action: cartRoute});
  }, [cartCountryCode, cartRoute, countryCode, fetcher, hasCart]);

  return null;
}
