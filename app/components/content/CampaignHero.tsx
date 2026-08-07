import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import styles from './CampaignHero.module.css';

export type CampaignHeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaTo?: string;
  image?: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
  className?: string;
};

/**
 * Full-bleed campaign hero — Afterstate season / drop introduction.
 */
export function CampaignHero({
  eyebrow = 'Afterstate 001',
  title = 'No Rush',
  subtitle = 'A slower pace for clothes made to last beyond the season.',
  ctaLabel = 'Explore the campaign',
  ctaTo = '/collections/afterstate-001',
  image,
  className,
}: CampaignHeroProps) {
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
      </div>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        {ctaLabel && ctaTo ? (
          <Link to={ctaTo} className={styles.cta} prefetch="intent">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
