import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import styles from './PurchaseNote.module.css';

export type PurchaseNoteProps = {
  /** Product tagged / badged as final sale — no change-of-mind returns. */
  finalSale?: boolean;
  /** Optional product-level shipping metafield override. */
  shippingNote?: string | null;
  className?: string;
};

/**
 * Short legal / returns hint under add-to-cart.
 */
export function PurchaseNote({
  finalSale = false,
  shippingNote,
  className,
}: PurchaseNoteProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {finalSale ? (
        <p className={styles.alert}>
          Final sale — not returnable for change of mind. Faulty items are still
          covered.
        </p>
      ) : (
        <p className={styles.text}>
          14-day returns on unworn items with tags. You pay return shipping
          unless we sent the wrong or faulty item.{' '}
          <LocaleAwareLink
            className={styles.link}
            prefetch="intent"
            to="/shipping-returns"
          >
            Shipping &amp; returns
          </LocaleAwareLink>
        </p>
      )}
      {shippingNote ? <p className={styles.text}>{shippingNote}</p> : null}
    </div>
  );
}

/** True when product badge or tags mark final sale. */
export function isFinalSaleProduct(input: {
  tags?: string[] | null;
  productBadge?: string | null;
}): boolean {
  const badge = input.productBadge?.toLowerCase() ?? '';
  if (badge.includes('final sale')) return true;

  return (input.tags ?? []).some((tag) => {
    const t = tag.toLowerCase().trim();
    return t === 'final sale' || t === 'final-sale' || t === 'finalsale';
  });
}
