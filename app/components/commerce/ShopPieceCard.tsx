import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {getHoverImage, getProductForm, getProductSizeLabels} from '~/lib/shop-catalog';
import {getShopCardImage, isShopCardStill} from '~/lib/shop-card-media';
import {getProductMetafields} from '~/lib/metafields';
import {useVariantUrl} from '~/lib/variants';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './ShopPieceCard.module.css';

export type ShopPieceCardProps = {
  product: CollectionGridProduct;
  lead?: boolean;
  sizes?: string;
};

/**
 * Framed shop still — overlay name, price, and a real view button.
 */
export function ShopPieceCard({
  product,
  lead,
  sizes = '(min-width: 64em) 24vw, (min-width: 45em) 44vw, 92vw',
}: ShopPieceCardProps) {
  const to = useVariantUrl(product.handle);
  const copy = useUiCopy();
  const form = getProductForm(product);
  const still = isShopCardStill(product.handle);
  const image = getShopCardImage(product);
  const hoverImage = still ? null : getHoverImage(product);
  const sizeLabels = getProductSizeLabels(product);
  const metafields = getProductMetafields(product);
  const soldOut = product.availableForSale === false;
  const showHover = Boolean(
    hoverImage?.url && hoverImage.url !== image?.url,
  );
  const overlayBadge = soldOut ? copy.shop.soldOut : metafields.productBadge;
  const sizesLabel = sizeLabels.join(' · ');

  return (
    <Link
      to={to}
      prefetch="intent"
      className={[
        styles.card,
        still ? styles.cardStill : styles.cardGarment,
        soldOut ? styles.cardSoldOut : null,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.frame}>
        {image?.url ? (
          still ? (
            <img
              src={image.url}
              alt={image.altText || product.title}
              width={image.width ?? 1536}
              height={image.height ?? 2048}
              loading={lead ? 'eager' : 'lazy'}
              decoding="async"
              className={styles.image}
            />
          ) : (
            <Image
              data={image}
              alt={image.altText || product.title}
              loading={lead ? 'eager' : 'lazy'}
              sizes={sizes}
              className={styles.image}
            />
          )
        ) : (
          <span className={styles.placeholder} aria-hidden="true" />
        )}
        {showHover && hoverImage?.url ? (
          <Image
            data={hoverImage}
            alt=""
            loading="lazy"
            sizes={sizes}
            className={styles.hoverImage}
          />
        ) : null}

        <div className={styles.veil} aria-hidden="true" />

        <p className={styles.formChip}>{form.label}</p>
        <ProductPrice
          price={product.priceRange?.minVariantPrice}
          compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
          className={styles.priceChip}
        />

        {overlayBadge ? (
          <p className={soldOut ? styles.soldBadge : styles.badge}>
            {overlayBadge}
          </p>
        ) : null}

        <div className={styles.overlay}>
          <h3 className={styles.title}>{product.title}</h3>
          {sizesLabel ? <p className={styles.sizes}>{sizesLabel}</p> : null}
          <span className={soldOut ? styles.ctaMuted : styles.cta}>
            {soldOut ? copy.shop.soldOut : copy.shop.view}
          </span>
        </div>
      </div>
    </Link>
  );
}
