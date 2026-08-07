import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import styles from './ProductPrice.module.css';

export type ProductPriceProps = {
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  className?: string;
};

/**
 * Product price with optional compare-at (sale) display.
 * Uses Hydrogen Money for currency formatting.
 */
export function ProductPrice({
  price,
  compareAtPrice,
  className,
}: ProductPriceProps) {
  const onSale =
    Boolean(compareAtPrice?.amount) &&
    Boolean(price?.amount) &&
    Number(compareAtPrice!.amount) > Number(price!.amount);

  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <div aria-label="Price" className={rootClass} role="group">
      {onSale ? (
        <div className={styles.onSale}>
          {price ? <Money data={price} className={styles.current} /> : null}
          <s className={styles.compare}>
            <Money data={compareAtPrice!} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} className={styles.current} />
      ) : (
        <span className={styles.placeholder}>&nbsp;</span>
      )}
    </div>
  );
}
