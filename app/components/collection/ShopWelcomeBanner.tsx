import {useEffect, useState} from 'react';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {SHOP_HERO_SLIDE_MS, SHOP_HERO_SLIDES} from '~/lib/shop-hero-media';
import {WELCOME_DISCOUNT_CODE} from '~/lib/welcomeOffer';
import styles from './ShopWelcomeBanner.module.css';

/**
 * Locked shop-rail CTA — vertical crop of the same lookbook stills as ShopHero.
 */
export function ShopWelcomeBanner({className}: {className?: string}) {
  const localePrefix = useLocalePathPrefix();
  const shopPath = prefixPathWithLocale('/shop', localePrefix);
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % SHOP_HERO_SLIDES.length);
    }, SHOP_HERO_SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, paused, index]);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <LocaleAwareLink
        className={styles.card}
        prefetch="intent"
        to={`/discount/${WELCOME_DISCOUNT_CODE}?redirect=${encodeURIComponent(shopPath)}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false);
          }
        }}
      >
        {SHOP_HERO_SLIDES.map((slide, slideIndex) => (
          <img
            key={slide.id}
            className={[
              styles.image,
              slideIndex === index ? styles.imageActive : null,
            ]
              .filter(Boolean)
              .join(' ')}
            src={slide.image}
            alt=""
            width={1600}
            height={900}
            loading={slideIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>New here</p>
          <p className={styles.title}>
            20% off.
            <span className={styles.accent}>Your first order.</span>
          </p>
          <p className={styles.caption}>Code {WELCOME_DISCOUNT_CODE}.</p>
          <span className={styles.cta}>
            Apply {WELCOME_DISCOUNT_CODE}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </LocaleAwareLink>
    </div>
  );
}
