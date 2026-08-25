import {ProductCard} from './ProductCard';
import {useVariantUrl} from '~/lib/variants';
import {getProductMetafields, getProductSubtitle} from '~/lib/metafields';
import {
  getHoverImage,
  getProductSwatches,
  getProductTypeLabel,
} from '~/lib/shop-catalog';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import styles from './ProductRecommendations.module.css';

export type RecommendedProduct = CollectionGridProduct;

export type ProductRecommendationsProps = {
  products: RecommendedProduct[];
  heading?: string;
  className?: string;
};

function RecommendationCard({product}: {product: RecommendedProduct}) {
  const to = useVariantUrl(product.handle);
  const metafields = getProductMetafields(product);

  return (
    <ProductCard
      to={to}
      title={product.title}
      subtitle={getProductSubtitle(product)}
      image={product.featuredImage}
      hoverImage={getHoverImage(product)}
      price={product.priceRange?.minVariantPrice}
      compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
      typeLabel={getProductTypeLabel(product)}
      badge={metafields.productBadge}
      availableForSale={product.availableForSale !== false}
      swatches={getProductSwatches(product)}
    />
  );
}

/**
 * Horizontal/grid product recommendations — no reviews or urgency copy.
 */
export function ProductRecommendations({
  products,
  heading = 'You may also like',
  className,
}: ProductRecommendationsProps) {
  if (!products.length) return null;

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={heading}
    >
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id}>
            <RecommendationCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
