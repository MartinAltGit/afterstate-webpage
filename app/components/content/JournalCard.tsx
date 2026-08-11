import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import styles from './JournalCard.module.css';

export type JournalCardProps = {
  to: string;
  title: string;
  eyebrow?: string;
  excerpt?: string;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  className?: string;
};

/**
 * Journal / editorial article teaser card.
 */
export function JournalCard({
  to,
  title,
  eyebrow = 'Journal',
  excerpt,
  image,
  className,
}: JournalCardProps) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')}>
      <Link to={to} prefetch="intent" className={styles.link}>
        <div className={styles.media}>
          {image?.url ? (
            image.url.includes('cdn.shopify.com') ? (
              <Image
                data={image}
                alt={image.altText || title}
                className={styles.image}
                sizes="(min-width: 45em) 33vw, 100vw"
              />
            ) : (
              <img
                src={image.url}
                alt={image.altText || title}
                width={image.width ?? 1200}
                height={image.height ?? 900}
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
            )
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
          )}
        </div>
        <div className={styles.meta}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h3 className={styles.title}>{title}</h3>
          {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
        </div>
      </Link>
    </article>
  );
}
