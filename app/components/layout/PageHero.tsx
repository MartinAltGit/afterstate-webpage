import type {ReactNode} from 'react';
import styles from './PageHero.module.css';

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  support?: string;
  imageSrc: string;
  imageAlt?: string;
  actions?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
};

/**
 * Full-bleed cinematic page opener — matches the homepage LandingHero language
 * for Shop, Limited, and Journal landings.
 */
export function PageHero({
  eyebrow,
  title,
  support,
  imageSrc,
  imageAlt = '',
  actions,
  align = 'start',
  className,
}: PageHeroProps) {
  return (
    <header
      className={[
        styles.root,
        align === 'center' ? styles.alignCenter : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.media} aria-hidden="true">
        <img
          className={styles.image}
          src={imageSrc}
          alt={imageAlt}
          width={2048}
          height={1152}
          decoding="async"
          fetchPriority="high"
        />
        <div className={styles.veil} />
        <div className={styles.grain} />
      </div>

      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {support ? <p className={styles.support}>{support}</p> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </header>
  );
}
