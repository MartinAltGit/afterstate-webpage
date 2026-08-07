import type {ReactNode} from 'react';
import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import styles from './SplitMediaText.module.css';

export type SplitMediaTextProps = {
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  mediaPosition?: 'left' | 'right';
  className?: string;
};

/**
 * Two-column media + copy layout for material stories and product features.
 */
export function SplitMediaText({
  eyebrow = 'Material',
  title = 'Built for the long wear',
  children,
  ctaLabel,
  ctaTo,
  image,
  mediaPosition = 'left',
  className,
}: SplitMediaTextProps) {
  return (
    <section
      className={[
        styles.root,
        mediaPosition === 'right' ? styles.mediaRight : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.media}>
        {image?.url ? (
          <Image
            data={image}
            alt={image.altText || title}
            className={styles.image}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children ? (
          <div className={styles.body}>{children}</div>
        ) : (
          <div className={styles.body}>
            <p>
              Dense cotton, clean construction, and finishes that hold up after
              years of wear — the Afterstate standard.
            </p>
          </div>
        )}
        {ctaLabel && ctaTo ? (
          <Link to={ctaTo} className={styles.cta} prefetch="intent">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
