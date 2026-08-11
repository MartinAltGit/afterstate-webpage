import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import styles from './EditorialImage.module.css';

export type EditorialImageProps = {
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  alt?: string;
  caption?: string;
  fullBleed?: boolean;
  className?: string;
};

/**
 * Full-width or framed editorial still for campaign and journal pages.
 */
export function EditorialImage({
  image,
  alt,
  caption = 'Afterstate — editorial still',
  fullBleed = true,
  className,
}: EditorialImageProps) {
  const resolvedAlt = alt ?? image?.altText ?? 'Afterstate';

  return (
    <section
      className={[
        styles.root,
        fullBleed ? styles.fullBleed : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <figure className={styles.figure}>
        <div className={styles.media}>
          {image?.url ? (
            image.url.includes('cdn.shopify.com') ? (
              <Image
                data={image}
                alt={resolvedAlt}
                className={styles.image}
                sizes="100vw"
              />
            ) : (
              <img
                src={image.url}
                alt={resolvedAlt}
                width={image.width ?? 1600}
                height={image.height ?? 1200}
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
            )
          ) : (
            <div className={styles.placeholder} role="img" aria-label={resolvedAlt} />
          )}
        </div>
        {caption ? (
          <figcaption className={styles.caption}>{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}
