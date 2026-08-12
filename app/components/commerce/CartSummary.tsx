import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {useId} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CheckoutButton} from './CheckoutButton';
import {DiscountForm} from './DiscountForm';
import styles from './CartSummary.module.css';

export type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  className?: string;
};

export function CartSummary({cart, className}: CartSummaryProps) {
  const headingId = useId();
  const discountCodes = cart?.discountCodes ?? [];

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <div className={styles.ledger}>
        <h2 id={headingId} className={styles.heading}>
          Summary
        </h2>
        <dl className={styles.total}>
          <dt>Subtotal</dt>
          <dd>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : (
              '—'
            )}
          </dd>
        </dl>
      </div>

      <DiscountForm discountCodes={discountCodes} />

      <CheckoutButton checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}
