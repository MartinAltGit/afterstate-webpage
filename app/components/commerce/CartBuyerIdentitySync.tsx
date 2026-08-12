import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher, useFetchers, useNavigation} from 'react-router';
import {useCartRoute} from '~/lib/cart-route';

type CartBuyerIdentitySyncProps = {
  cartId?: string | null;
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
 *
 * Must not run right after add-to-cart: Hydrogen's identity update creates a
 * *new empty cart* when the cart cookie is not on that request yet, which
 * looks like the just-added line vanishing after ~1s.
 */
export function CartBuyerIdentitySync({
  cartId,
  countryCode,
  cartCountryCode,
  hasCart,
}: CartBuyerIdentitySyncProps) {
  const fetcher = useFetcher();
  const fetchers = useFetchers();
  const navigation = useNavigation();
  const cartRoute = useCartRoute();
  const lastSubmitted = useRef<string | null>(null);

  const cartMutationInFlight = fetchers.some((active) => {
    const action = active.formAction ?? '';
    return (
      active.state !== 'idle' &&
      (action === cartRoute || action.endsWith('/cart'))
    );
  });

  // Root revalidation after add-to-cart — wait until loaders settle so the
  // cart cookie is present before we POST another cart mutation.
  const revalidating = navigation.state !== 'idle';

  useEffect(() => {
    if (!hasCart || !cartId || !countryCode) return;
    // Missing country is not a mismatch — wait for the cart query to return it.
    if (!cartCountryCode) return;
    if (cartCountryCode.toUpperCase() === countryCode.toUpperCase()) {
      lastSubmitted.current = `${cartId}:${countryCode}`;
      return;
    }
    if (cartMutationInFlight || revalidating) return;
    if (fetcher.state !== 'idle') return;

    const key = `${cartId}:${countryCode}`;
    if (lastSubmitted.current === key) return;

    lastSubmitted.current = key;

    const formData = new FormData();
    formData.set(
      CartForm.INPUT_NAME,
      JSON.stringify({
        action: CartForm.ACTIONS.BuyerIdentityUpdate,
        inputs: {
          cartId,
          buyerIdentity: {countryCode},
        },
      }),
    );

    fetcher.submit(formData, {method: 'post', action: cartRoute});
  }, [
    cartCountryCode,
    cartId,
    cartMutationInFlight,
    cartRoute,
    countryCode,
    fetcher,
    hasCart,
    revalidating,
  ]);

  return null;
}
