import {ProductCard} from '~/components/commerce/ProductCard';
import {Reveal} from '~/components/motion/Reveal';
import {getProductMetafields, getProductSubtitle} from '~/lib/metafields';
import {
  getHoverImage,
  getProductSwatches,
  getProductTypeLabel,
} from '~/lib/shop-catalog';
import {useVariantUrl} from '~/lib/variants';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import styles from './CollectionProductGrid.module.css';

export type CollectionGridProduct = {
  id: string;
  handle: string;
  title: string;
  productType?: string | null;
  tags?: string[] | null;
  availableForSale?: boolean;
  featuredImage?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  images?: {
    nodes?: Array<{
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null> | null;
  } | null;
  options?: Array<{
    name: string;
    optionValues?: Array<{name: string} | null> | null;
  } | null> | null;
  priceRange?: {
    minVariantPrice: MoneyV2;
  };
  compareAtPriceRange?: {
    minVariantPrice?: MoneyV2 | null;
  } | null;
  productBadge?: {value?: string | null} | null;
};

export type CollectionProductGridProps = {
  products: CollectionGridProduct[];
  className?: string;
  emptyMessage?: string;
  layout?: 'editorial' | 'catalog';
};

function GridCard({
  product,
  index,
  featured,
}: {
  product: CollectionGridProduct;
  index: number;
  featured: boolean;
}) {
  const to = useVariantUrl(product.handle);
  const metafields = getProductMetafields(product);
  const hoverImage = getHoverImage(product);
  const sizes = featured
    ? '(min-width: 70em) 42vw, (min-width: 45em) 50vw, 92vw'
    : '(min-width: 70em) 28vw, (min-width: 45em) 45vw, 50vw';

  return (
    <ProductCard
      to={to}
      title={product.title}
      subtitle={getProductSubtitle(product)}
      image={product.featuredImage}
      hoverImage={hoverImage}
      price={product.priceRange?.minVariantPrice}
      compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
      typeLabel={getProductTypeLabel(product)}
      badge={metafields.productBadge}
      availableForSale={product.availableForSale !== false}
      swatches={getProductSwatches(product)}
      featured={featured}
      loading={index < 4 ? 'eager' : 'lazy'}
      sizes={sizes}
    />
  );
}

/**
 * Collection product grid — editorial mosaic or even catalog.
 */
export function CollectionProductGrid({
  products,
  className,
  emptyMessage = 'No products in this collection.',
  layout = 'catalog',
}: CollectionProductGridProps) {
  if (!products.length) {
    return (
      <p className={[styles.empty, className].filter(Boolean).join(' ')}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul
      className={[
        styles.grid,
        layout === 'editorial' ? styles.editorial : styles.catalog,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {products.map((product, index) => {
        const featured = layout === 'editorial' && index < 2;
        return (
          <Reveal
            key={product.id}
            as="li"
            delayMs={Math.min(index, 8) * 80}
          >
            <GridCard product={product} index={index} featured={featured} />
          </Reveal>
        );
      })}
    </ul>
  );
}
