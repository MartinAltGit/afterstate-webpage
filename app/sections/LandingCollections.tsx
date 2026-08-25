import {useRef, type CSSProperties, type MouseEvent} from 'react';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {Reveal} from '~/components/motion/Reveal';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {SHOP_HERO_SLIDES} from '~/lib/shop-hero-media';
import {shopCatalogSearch} from '~/lib/shop-catalog';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './LandingCollections.module.css';

function CollectionCard({
  item,
  index,
}: {
  item: (typeof SHOP_HERO_SLIDES)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const copy = useUiCopy();
  const number = String(index + 1).padStart(2, '0');

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty('--shine-x', `${50 + x * 40}%`);
    cardRef.current.style.setProperty('--shine-y', `${50 + y * 40}%`);
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--shine-x', '68%');
    cardRef.current.style.setProperty('--shine-y', '28%');
  };

  return (
    <Reveal as="li" delayMs={index * 80}>
      <article
        ref={cardRef}
        className={styles.card}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={
          {
            '--shine-x': '68%',
            '--shine-y': '28%',
          } as CSSProperties
        }
      >
        <LocaleAwareLink
          className={styles.link}
          prefetch="intent"
          to={`/shop${shopCatalogSearch('all', item.id)}`}
        >
          <div className={styles.frame}>
            <img
              className={styles.image}
              src={item.image}
              alt={item.alt}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.scrim} aria-hidden="true" />
            <span className={styles.shine} aria-hidden="true" />
            <span className={styles.plate} aria-hidden="true">
              {number}
            </span>
            <div className={styles.copy}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.pieces}>{item.pieces}</p>
              <span className={styles.shop}>
                {copy.landing.shopDesign}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </LocaleAwareLink>
      </article>
    </Reveal>
  );
}

/**
 * Four design chapters — campaign stills composed with type on the dark stone.
 */
export function LandingCollections({className}: {className?: string}) {
  const copy = useUiCopy();
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="landing-collections-title"
    >
      <Reveal as="header" className={styles.header}>
        <p className={styles.eyebrow}>{copy.landing.collectionsEyebrow}</p>
        <h2 id="landing-collections-title" className={styles.title}>
          {copy.landing.collectionsTitle}{' '}
          <span className={styles.accent}>{copy.landing.collectionsAccent}</span>
        </h2>
        <p className={styles.lede}>{copy.landing.collectionsLede}</p>
      </Reveal>

      <ul className={styles.grid} aria-label={copy.landing.collectionsAria}>
        {SHOP_HERO_SLIDES.map((item, index) => (
          <CollectionCard key={item.id} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}
