import {CartForm} from '@shopify/hydrogen';
import {useId} from 'react';
import styles from './DiscountForm.module.css';

export type DiscountFormProps = {
  appliedCodes?: string[];
  className?: string;
};

/**
 * Apply / remove cart discount codes via CartForm.
 */
export function DiscountForm({
  appliedCodes = [],
  className,
}: DiscountFormProps) {
  const inputId = useId();
  const headingId = useId();

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className={styles.heading}>
        Discount
      </h3>

      {appliedCodes.length > 0 ? (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.DiscountCodesUpdate}
          inputs={{discountCodes: []}}
        >
          <div className={styles.applied}>
            <code>{appliedCodes.join(', ')}</code>
            <button type="submit" className={styles.remove}>
              Remove
            </button>
          </div>
        </CartForm>
      ) : null}

      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.DiscountCodesUpdate}
        inputs={{discountCodes: appliedCodes}}
      >
        <div className={styles.form}>
          <label htmlFor={inputId} className={styles.srOnly}>
            Discount code
          </label>
          <input
            id={inputId}
            type="text"
            name="discountCode"
            placeholder="Code"
            className={styles.input}
            autoComplete="off"
          />
          <button type="submit" className={styles.apply}>
            Apply
          </button>
        </div>
      </CartForm>
    </section>
  );
}
