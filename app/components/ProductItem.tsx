import type {CurrencyCode, MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {ProductCard} from '~/components/commerce/ProductCard';
import {getProductSubtitle} from '~/lib/metafields';
import {useVariantUrl} from '~/lib/variants';

export {ProductCard} from '~/components/commerce/ProductCard';

type ProductItemProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  subtitle?: {value?: string | null} | null;
};

/**
 * Compatibility wrapper around Afterstate ProductCard.
 * Prefer importing ProductCard directly in new code.
 */
export function ProductItem({
  product,
  loading,
}: {
  product: ProductItemProduct;
  loading?: 'eager' | 'lazy';
}) {
  const to = useVariantUrl(product.handle);
  const price: MoneyV2 = {
    amount: product.priceRange.minVariantPrice.amount,
    currencyCode: product.priceRange.minVariantPrice
      .currencyCode as CurrencyCode,
  };

  return (
    <ProductCard
      to={to}
      title={product.title}
      subtitle={getProductSubtitle(product)}
      image={product.featuredImage}
      price={price}
      loading={loading}
    />
  );
}
