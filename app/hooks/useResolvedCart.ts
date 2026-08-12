import {useFetchers} from 'react-router';
import {useOptimisticCart, type OptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartActionData = {
  cart?: CartApiQueryFragment | null;
};

function cartScore(cart: CartApiQueryFragment | null | undefined) {
  if (!cart) return -1;
  const lines = cart.lines?.nodes?.length ?? 0;
  const quantity = cart.totalQuantity ?? 0;
  return lines * 1000 + quantity;
}

/**
 * Prefer the newest cart mutation result when root `cart.get()` is still stale
 * (common right after add-to-cart, before the cart cookie is on the next load).
 *
 * Also guard against Hydrogen `useOptimisticCart` wiping quantity when a
 * mutation response has `totalQuantity` but no `lines` payload yet.
 */
export function useResolvedCart(
  originalCart: CartApiQueryFragment | null,
): OptimisticCart<CartApiQueryFragment | null> {
  const fetchers = useFetchers();
  let cart = originalCart;

  for (const fetcher of fetchers) {
    const next = (fetcher.data as CartActionData | undefined)?.cart;
    if (!next?.id) continue;
    if (cartScore(next) >= cartScore(cart)) {
      cart = next;
    }
  }

  const optimistic = useOptimisticCart(cart);
  const optimisticQty = optimistic?.totalQuantity ?? 0;
  const sourceQty = cart?.totalQuantity ?? 0;

  // useOptimisticCart rebuilds totalQuantity from `lines.nodes`. If a cart
  // payload is missing lines, it reports 0 even when the server added items.
  if (sourceQty > 0 && optimisticQty === 0 && !optimistic?.isOptimistic) {
    return cart as OptimisticCart<CartApiQueryFragment | null>;
  }

  return optimistic;
}
