import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {MoneyV2, Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import {ProductPrice} from './ProductPrice';
import styles from './ProductCard.module.css';

export type ProductCardProps = {
  to: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  loading?: 'eager' | 'lazy';
  className?: string;
};

/**
 * Editorial product card — image, title, optional subtitle slot, price.
 * No badges or promotional chrome.
 */
export function ProductCard({
  to,
  title,
  subtitle,
  image,
  price,
  compareAtPrice,
  loading = 'lazy',
  className,
}: ProductCardProps) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')}>
      <Link to={to} prefetch="intent" className={styles.link}>
        <div className={styles.media}>
          {image?.url ? (
            <Image
              data={image}
              alt={image.altText || title}
              aspectRatio="3/4"
              loading={loading}
              sizes="(min-width: 45em) 25vw, 50vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
          )}
        </div>
        <div className={styles.meta}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          <ProductPrice
            price={price ?? undefined}
            compareAtPrice={compareAtPrice}
            className={styles.price}
          />
        </div>
      </Link>
    </article>
  );
}
