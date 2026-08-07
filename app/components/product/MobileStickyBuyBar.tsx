import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {AddToCartButton} from '~/components/commerce/AddToCartButton';
import styles from './MobileStickyBuyBar.module.css';

export type MobileStickyBuyBarProps = {
  title: string;
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  availableForSale?: boolean;
  lines: OptimisticCartLineInput[];
  onAddToCart?: () => void;
  analytics?: unknown;
  className?: string;
  /** When false, bar is hidden (e.g. desktop). Defaults to true — CSS hides on large screens. */
  visible?: boolean;
};

/**
 * Mobile sticky buy bar — title, price, add to cart. No scarcity timers.
 */
export function MobileStickyBuyBar({
  title,
  price,
  compareAtPrice,
  availableForSale = true,
  lines,
  onAddToCart,
  analytics,
  className,
  visible = true,
}: MobileStickyBuyBarProps) {
  if (!visible) return null;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Quick buy"
    >
      <div className={styles.meta}>
        <p className={styles.title}>{title}</p>
        <ProductPrice price={price} compareAtPrice={compareAtPrice} />
      </div>
      <AddToCartButton
        disabled={!availableForSale || lines.length === 0}
        lines={lines}
        onClick={onAddToCart}
        analytics={analytics}
        className={styles.cta}
      >
        {availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}
