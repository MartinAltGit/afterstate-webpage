import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {displayArticleTitle} from '~/lib/blog/articleHtml';
import styles from './BlogFeatured.module.css';

export type BlogFeaturedProps = {
  to: string;
  title: string;
  eyebrow?: string;
  excerpt?: string;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  label?: string;
  priority?: boolean;
};

/**
 * Full-bleed story cover — used for every article on the blog index, stacked newest first.
 */
export function BlogFeatured({
  to,
  title,
  eyebrow,
  excerpt,
  image,
  label,
  priority = false,
}: BlogFeaturedProps) {
  const loading = priority ? 'eager' : 'lazy';

  return (
    <article className={[styles.root, priority ? styles.lead : null].filter(Boolean).join(' ')}>
      <LocaleAwareLink to={to} prefetch="intent" className={styles.link}>
        <div className={styles.media} aria-hidden={!image?.url}>
          {image?.url ? (
            image.url.includes('cdn.shopify.com') ? (
              <Image
                data={image}
                alt={image.altText || title}
                className={styles.image}
                sizes="100vw"
                loading={loading}
              />
            ) : (
              <img
                src={image.url}
                alt={image.altText || title}
                width={image.width ?? 1600}
                height={image.height ?? 1000}
                className={styles.image}
                loading={loading}
                decoding="async"
                fetchPriority={priority ? 'high' : 'low'}
              />
            )
          ) : (
            <div className={styles.placeholder} />
          )}
          <div className={styles.veil} />
          <div className={styles.grain} />
        </div>

        <div className={styles.copy}>
          {label || eyebrow ? (
            <p className={styles.kicker}>
              {label ? <span className={styles.label}>{label}</span> : null}
              {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
            </p>
          ) : null}
          <h2 className={styles.title}>{displayArticleTitle(title)}</h2>
          {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
          <span className={styles.cta}>
            <span>Read the story</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </LocaleAwareLink>
    </article>
  );
}
