import {ProductCard} from '~/components/commerce/ProductCard';
import {getProductMetafields, getProductSubtitle} from '~/lib/metafields';
import {
  getHoverImage,
  getProductSwatches,
  getProductTypeLabel,
} from '~/lib/shop-catalog';
import {useVariantUrl} from '~/lib/variants';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';

export {ProductCard} from '~/components/commerce/ProductCard';

/**
 * Compatibility wrapper around Afterstate ProductCard.
 * Prefer importing ProductCard directly in new code.
 */
export function ProductItem({
  product,
  loading,
}: {
  product: CollectionGridProduct;
  loading?: 'eager' | 'lazy';
}) {
  const to = useVariantUrl(product.handle);

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
      badge={getProductMetafields(product).productBadge}
      availableForSale={product.availableForSale !== false}
      swatches={getProductSwatches(product)}
      loading={loading}
    />
  );
}
