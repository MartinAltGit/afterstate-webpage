import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import styles from './LookbookSequence.module.css';

export type LookbookFrame = {
  id: string;
  caption?: string;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
};

export type LookbookSequenceProps = {
  eyebrow?: string;
  title?: string;
  frames?: LookbookFrame[];
  className?: string;
};

const DEFAULT_FRAMES: LookbookFrame[] = [
  {id: 'look-01', caption: 'Look 01'},
  {id: 'look-02', caption: 'Look 02'},
  {id: 'look-03', caption: 'Look 03'},
  {id: 'look-04', caption: 'Look 04'},
];

/**
 * Horizontal lookbook sequence for campaign and collection storytelling.
 */
export function LookbookSequence({
  eyebrow = 'Lookbook',
  title = 'Afterstate 001 — No Rush',
  frames = DEFAULT_FRAMES,
  className,
}: LookbookSequenceProps) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="lookbook-title"
    >
      <header className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 id="lookbook-title" className={styles.title}>
          {title}
        </h2>
      </header>
      <div className={styles.track}>
        {frames.map((frame) => (
          <figure key={frame.id} className={styles.frame}>
            <div className={styles.media}>
              {frame.image?.url ? (
                <Image
                  data={frame.image}
                  alt={frame.image.altText || frame.caption || title}
                  className={styles.image}
                  sizes="(min-width: 45em) 22vw, 70vw"
                />
              ) : (
                <div className={styles.placeholder} aria-hidden="true" />
              )}
            </div>
            {frame.caption ? (
              <figcaption className={styles.caption}>{frame.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
