import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLine} from './CartLine';
import {CartSummary} from './CartSummary';
import styles from './CartDrawer.module.css';

export type CartDrawerProps = {
  cart: CartApiQueryFragment | null;
  className?: string;
};

/**
 * Cart drawer body — lines + summary. Pair with Aside type="cart".
 */
export function CartDrawer({cart: originalCart, className}: CartDrawerProps) {
  const cart = useOptimisticCart(originalCart);
  const {close} = useAside();
  const lines = cart?.lines?.nodes ?? [];
  const hasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);

  const parentLines = lines.filter(
    (line) =>
      !(
        'parentRelationship' in line &&
        line.parentRelationship?.parent
      ),
  );

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Cart"
    >
      {!hasItems ? (
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link to="/shop" onClick={close} prefetch="intent" className={styles.continue}>
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className={styles.lines}>
            {parentLines.map((line) => (
              <CartLine key={line.id} line={line} onNavigate={close} />
            ))}
          </ul>
          <CartSummary cart={cart} className={styles.summary} />
        </>
      )}
    </section>
  );
}
