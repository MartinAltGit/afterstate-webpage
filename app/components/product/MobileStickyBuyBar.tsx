import {useEffect, useState} from 'react';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {AddToCartButton} from '~/components/commerce/AddToCartButton';
import styles from './MobileStickyBuyBar.module.css';

export type MobileStickyBuyBarProps = {
  title: string;
  detail?: string | null;
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  availableForSale?: boolean;
  lines: OptimisticCartLineInput[];
  onAddToCart?: () => void;
  analytics?: unknown;
  className?: string;
  /** When false, bar is hidden (e.g. desktop). Defaults to true — CSS hides on large screens. */
  visible?: boolean;
  productHandle?: string;
  productTitle?: string;
};

/**
 * Mobile sticky buy bar — appears after the main CTA leaves view.
 */
export function MobileStickyBuyBar({
  title,
  detail,
  price,
  compareAtPrice,
  availableForSale = true,
  lines,
  onAddToCart,
  analytics,
  className,
  visible = true,
  productHandle,
}: MobileStickyBuyBarProps) {
  const [pastCta, setPastCta] = useState(false);

  useEffect(() => {
    const el = document.getElementById('product-buy-cta');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastCta(!entry?.isIntersecting),
      {threshold: 0.15},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  const showDemand = !availableForSale && Boolean(productHandle);
  const revealed = pastCta;

  return (
    <div
      className={[
        styles.root,
        revealed ? styles.revealed : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="region"
      aria-label="Quick buy"
      aria-hidden={!revealed}
    >
      <div className={styles.meta}>
        <p className={styles.title}>{title}</p>
        {detail ? <p className={styles.detail}>{detail}</p> : null}
        <ProductPrice price={price} compareAtPrice={compareAtPrice} />
      </div>
      {showDemand ? (
        <a className={styles.notify} href="#demand-capture">
          Notify me
        </a>
      ) : (
        <AddToCartButton
          disabled={!availableForSale || lines.length === 0}
          lines={lines}
          onClick={onAddToCart}
          analytics={analytics}
          className={styles.cta}
        >
          {availableForSale ? 'Add' : 'Sold out'}
        </AddToCartButton>
      )}
    </div>
  );
}
