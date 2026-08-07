import {ProductCard} from '~/components/commerce/ProductCard';
import {useVariantUrl} from '~/lib/variants';
import type {MoneyV2, Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import styles from './CollectionProductGrid.module.css';

export type CollectionGridProduct = {
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

export type CollectionProductGridProps = {
  products: CollectionGridProduct[];
  className?: string;
  emptyMessage?: string;
};

function GridCard({
  product,
  index,
}: {
  product: CollectionGridProduct;
  index: number;
}) {
  const to = useVariantUrl(product.handle);
  return (
    <ProductCard
      to={to}
      title={product.title}
      subtitle={product.subtitle}
      image={product.featuredImage}
      price={product.priceRange?.minVariantPrice}
      compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
      loading={index < 4 ? 'eager' : 'lazy'}
    />
  );
}

/**
 * Collection product grid — editorial cards, no badge spam.
 */
export function CollectionProductGrid({
  products,
  className,
  emptyMessage = 'No products in this collection.',
}: CollectionProductGridProps) {
  if (!products.length) {
    return (
      <p className={[styles.empty, className].filter(Boolean).join(' ')}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className={[styles.grid, className].filter(Boolean).join(' ')}>
      {products.map((product, index) => (
        <li key={product.id}>
          <GridCard product={product} index={index} />
        </li>
      ))}
    </ul>
  );
}
