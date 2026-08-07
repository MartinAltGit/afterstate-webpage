import {ProductCard} from './ProductCard';
import {useVariantUrl} from '~/lib/variants';
import type {MoneyV2, Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import styles from './ProductRecommendations.module.css';

export type RecommendedProduct = {
  id: string;
  handle: string;
  title: string;
  subtitle?: string | null;
  featuredImage?: Pick<
    ImageType,
    'id' | 'url' | 'altText' | 'width' | 'height'
  > | null;
  priceRange?: {
    minVariantPrice: MoneyV2;
  };
  compareAtPriceRange?: {
    minVariantPrice?: MoneyV2 | null;
  } | null;
};

export type ProductRecommendationsProps = {
  products: RecommendedProduct[];
  heading?: string;
  className?: string;
};

function RecommendationCard({product}: {product: RecommendedProduct}) {
  const to = useVariantUrl(product.handle);
  return (
    <ProductCard
      to={to}
      title={product.title}
      subtitle={product.subtitle}
      image={product.featuredImage}
      price={product.priceRange?.minVariantPrice}
      compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
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
