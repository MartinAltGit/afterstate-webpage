import {Money, type OptimisticCart} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {
  isWelcomeDiscountCode,
  WELCOME_DISCOUNT_PERCENT,
} from '~/lib/welcomeOffer';
import {CheckoutButton} from './CheckoutButton';
import {DiscountForm} from './DiscountForm';
import styles from './CartSummary.module.css';

export type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  className?: string;
};

export function CartSummary({cart, className}: CartSummaryProps) {
  const discountCodes = cart?.discountCodes ?? [];
  const subtotal = cart?.cost?.subtotalAmount;
  const total = cart?.cost?.totalAmount;
  const {current, compare} = getVisiblePrice(subtotal, total, discountCodes);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Summary"
    >
      <div className={styles.ledger}>
        <dl className={styles.total}>
          <dt>Subtotal</dt>
          <dd>
            {current?.amount ? (
              <span className={styles.pricePair}>
                <Money data={current} />
                {compare?.amount ? (
                  <s className={styles.compare}>
                    <Money data={compare} />
                  </s>
                ) : null}
              </span>
            ) : (
              '—'
            )}
          </dd>
        </dl>
      </div>

      <DiscountForm discountCodes={discountCodes} />

      <CheckoutButton checkoutUrl={cart?.checkoutUrl} />

      <p className={styles.policyNote}>
        By checking out you agree to our{' '}
        <LocaleAwareLink className={styles.policyLink} to="/policies/terms-of-service">
          Terms
        </LocaleAwareLink>
        . Change-of-mind returns: you pay return postage unless the item is
        faulty or wrong.{' '}
        <LocaleAwareLink className={styles.policyLink} to="/shipping-returns">
          Details
        </LocaleAwareLink>
      </p>
    </div>
  );
}

type MoneyPiece = Partial<Pick<MoneyV2, 'amount' | 'currencyCode'>>;

function getVisiblePrice(
  subtotal: MoneyPiece | null | undefined,
  total: MoneyPiece | null | undefined,
  discountCodes: CartApiQueryFragment['discountCodes'],
) {
  if (!subtotal?.amount || !subtotal.currencyCode) {
    return {current: subtotal ?? null, compare: null};
  }

  // Prefer Shopify’s real discounted total when the code is already allocated.
  if (total?.amount && Number(total.amount) < Number(subtotal.amount)) {
    return {current: total, compare: subtotal};
  }

  // Welcome20 often stays “not applicable” until checkout — still show 20% off.
  const hasWelcome = discountCodes.some((discount) =>
    isWelcomeDiscountCode(discount.code),
  );
  if (hasWelcome) {
    return {
      current: {
        amount: (
          Number(subtotal.amount) *
          (1 - WELCOME_DISCOUNT_PERCENT)
        ).toFixed(2),
        currencyCode: subtotal.currencyCode,
      },
      compare: subtotal,
    };
  }

  return {current: subtotal, compare: null};
}
