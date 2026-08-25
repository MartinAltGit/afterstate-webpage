import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {ProductPrice} from './ProductPrice';
import type {ProductSwatch} from '~/lib/shop-catalog';
import styles from './ProductCard.module.css';

export type ProductCardImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ProductCardProps = {
  to: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: ProductCardImage | null;
  hoverImage?: ProductCardImage | null;
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  typeLabel?: string | null;
  badge?: string | null;
  availableForSale?: boolean;
  swatches?: ProductSwatch[];
  featured?: boolean;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  className?: string;
};

/**
 * Unboxed product still — garment on the canvas, caption underneath.
 * The shop catalog uses ShopFamily instead of this card.
 */
export function ProductCard({
  to,
  title,
  subtitle,
  image,
  hoverImage,
  price,
  compareAtPrice,
  typeLabel,
  badge,
  availableForSale = true,
  swatches = [],
  featured = false,
  loading = 'lazy',
  sizes = '(min-width: 70em) 28vw, (min-width: 45em) 45vw, 50vw',
  className,
}: ProductCardProps) {
  const soldOut = availableForSale === false;
  const overlayBadge = soldOut ? 'Sold out' : badge;
  const showHover = Boolean(hoverImage?.url && hoverImage.url !== image?.url);

  return (
    <article
      className={[
        styles.card,
        featured ? styles.featured : null,
        soldOut ? styles.soldOut : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Link to={to} prefetch="intent" className={styles.link}>
        <div className={styles.media}>
          {image?.url ? (
            <Image
              data={image}
              alt={image.altText || title}
              loading={loading}
              sizes={sizes}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
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
          {overlayBadge ? (
            <p className={soldOut ? styles.soldBadge : styles.badge}>
              {overlayBadge}
            </p>
          ) : null}
        </div>
        <div className={styles.meta}>
          {typeLabel ? <p className={styles.eyebrow}>{typeLabel}</p> : null}
          <h3 className={styles.title}>{title}</h3>
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          <div className={styles.row}>
            <ProductPrice
              price={price ?? undefined}
              compareAtPrice={compareAtPrice}
              className={styles.price}
            />
            {swatches.length > 1 ? (
              <ul className={styles.swatches} aria-label="Available colours">
                {swatches.map((swatch) => (
                  <li key={swatch.name}>
                    <span
                      className={styles.swatch}
                      style={
                        swatch.color
                          ? {backgroundColor: swatch.color}
                          : undefined
                      }
                      title={swatch.name}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
