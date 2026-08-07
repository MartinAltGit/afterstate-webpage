import {
  ProductRecommendations,
  type RecommendedProduct,
} from '~/components/commerce/ProductRecommendations';
import styles from './RelatedProducts.module.css';

export type RelatedProductsProps = {
  products: RecommendedProduct[];
  heading?: string;
  className?: string;
};

/**
 * Related products grid for product detail pages.
 */
export function RelatedProducts({
  products,
  heading = 'Related',
  className,
}: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <ProductRecommendations
      products={products}
      heading={heading}
      className={[styles.root, className].filter(Boolean).join(' ')}
    />
  );
}
