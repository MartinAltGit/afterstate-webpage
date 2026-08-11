import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import styles from './CollectionHero.module.css';

export type CollectionHeroProps = {
  title: string;
  description?: string | null;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  className?: string;
};

/**
 * Full-bleed collection hero — title + optional description over imagery.
 * Wireframe: edge-to-edge media plane, brand/collection title as primary signal.
 */
export function CollectionHero({
  title,
  description,
  image,
  className,
}: CollectionHeroProps) {
  return (
    <header className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.media} aria-hidden={!image}>
        {image?.url ? (
          <Image
            data={image}
            alt=""
            className={styles.image}
            sizes="100vw"
            loading="eager"
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.veil} aria-hidden="true" />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.title}>{title}</h1>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </header>
  );
}
