import {useId, useState} from 'react';
import {ProductMedia, type ProductMediaItem} from './ProductMedia';
import styles from './ProductGallery.module.css';

export type ProductGalleryProps = {
  media: ProductMediaItem[];
  className?: string;
};

/**
 * Product media gallery. Main (selected) media is not lazy-loaded.
 * Supports image and video items.
 */
export function ProductGallery({media, className}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const labelId = useId();
  const items = media.length > 0 ? media : [];
  const active = items[activeIndex] ?? items[0];

  if (!active) {
    return (
      <div
        className={[styles.root, className].filter(Boolean).join(' ')}
        aria-label="Product gallery"
      >
        <div className={styles.empty} />
      </div>
    );
  }

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={labelId}
    >
      <p id={labelId} className={styles.srOnly}>
        Product gallery
      </p>
      <div className={styles.main}>
        <ProductMedia key={active.id} media={active} priority />
      </div>
      {items.length > 1 ? (
        <ul className={styles.thumbs}>
          {items.map((item, index) => {
            const selected = index === activeIndex;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={[
                    styles.thumb,
                    selected ? styles.thumbSelected : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={`View media ${index + 1}`}
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => setActiveIndex(index)}
                >
                  <ProductMedia media={item} priority={false} sizes="80px" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
