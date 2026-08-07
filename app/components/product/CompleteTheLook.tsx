import {
  ProductRecommendations,
  type RecommendedProduct,
} from '~/components/commerce/ProductRecommendations';
import styles from './CompleteTheLook.module.css';

export type CompleteTheLookProps = {
  products: RecommendedProduct[];
  heading?: string;
  className?: string;
};

/**
 * Styled pairing products for a complete look.
 */
export function CompleteTheLook({
  products,
  heading = 'Complete the look',
  className,
}: CompleteTheLookProps) {
  if (!products.length) return null;

  return (
    <ProductRecommendations
      products={products}
      heading={heading}
      className={[styles.root, className].filter(Boolean).join(' ')}
    />
  );
}
