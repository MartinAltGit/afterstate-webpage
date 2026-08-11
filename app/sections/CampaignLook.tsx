import {Link} from 'react-router';
import {Reveal} from '~/components/motion/Reveal';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './CampaignLook.module.css';

export type CampaignLookProps = {
  imageSrc: string;
  eyebrow?: string;
  title?: string;
  caption?: string;
  ctaLabel?: string;
  ctaTo?: string;
  className?: string;
};

/**
 * Immersive campaign look — bridges the opener and the shop.
 */
export function CampaignLook({
  imageSrc,
  eyebrow = 'Limited edition',
  title = '001 — No Rush',
  caption = 'A short run. When it’s gone, it’s gone.',
  ctaLabel = 'Explore the collection',
  ctaTo = '/collections/afterstate-001',
  className,
}: CampaignLookProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="campaign-look-title"
    >
      <Reveal as="figure" className={styles.figure} delayMs={60}>
        <div className={styles.frame}>
          <img
            className={styles.image}
            src={imageSrc}
            alt="Model wearing Afterstate hoodie with AS logo"
            width={2048}
            height={878}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} aria-hidden="true" />
          <Reveal className={styles.copy} delayMs={120}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            <h2 id="campaign-look-title" className={styles.title}>
              {title}
            </h2>
            {caption ? <p className={styles.caption}>{caption}</p> : null}
            {ctaLabel && ctaTo ? (
              <Link
                className={styles.cta}
                prefetch="intent"
                to={prefixPathWithLocale(ctaTo, localePrefix)}
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
