import {useEffect, useId, useState, type CSSProperties} from 'react';
import {Link, useLocation} from 'react-router';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {SHOP_HERO_SLIDE_MS, SHOP_HERO_SLIDES} from '~/lib/shop-hero-media';
import styles from './ShopHero.module.css';

export type ShopHeroProps = {
  designCount: number;
};

/**
 * Lookbook opener — one cinematic still per design, two models wearing the three pieces.
 */
export function ShopHero({designCount}: ShopHeroProps) {
  const {pathname} = useLocation();
  const reduced = usePrefersReducedMotion();
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SHOP_HERO_SLIDES[index] ?? SHOP_HERO_SLIDES[0];

  useEffect(() => {
    if (reduced || paused) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % SHOP_HERO_SLIDES.length);
    }, SHOP_HERO_SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, paused, index]);

  const goTo = (next: number) => {
    const length = SHOP_HERO_SLIDES.length;
    setIndex(((next % length) + length) % length);
  };

  return (
    <header
      className={[styles.root, paused ? styles.paused : null]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={labelId}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(index + 1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(index - 1);
        }
      }}
    >
      <div className={styles.media} data-slideshow="wide">
        {SHOP_HERO_SLIDES.map((entry, slideIndex) => (
          <img
            key={entry.id}
            className={[
              styles.image,
              slideIndex === index ? styles.imageActive : null,
            ]
              .filter(Boolean)
              .join(' ')}
            src={entry.image}
            alt={slideIndex === index ? entry.alt : ''}
            width={1600}
            height={900}
            loading={slideIndex === 0 ? 'eager' : 'lazy'}
            decoding={slideIndex === 0 ? 'sync' : 'async'}
            fetchPriority={slideIndex === 0 ? 'high' : 'low'}
            style={{'--shop-hero-crop': entry.crop} as CSSProperties}
          />
        ))}
        <div className={styles.veil} />
        <div className={styles.grain} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            Afterstate 001 — {String(designCount).padStart(2, '0')} limited
            editions
          </p>
          <h1 id={labelId} className={styles.title}>
            Made once.
            <span className={styles.accent}>Worn for years.</span>
          </h1>
          <p className={styles.support}>
            Short runs. Numbered pieces. No restocks.
          </p>
          <Link
            to={`${pathname}#design-${slide.id}`}
            className={styles.cta}
            aria-live="polite"
          >
            <span className={styles.ctaShort}>Shop the drop</span>
            <span className={styles.ctaFull}>Shop {slide.name}</span>
          </Link>
        </div>

        <div className={styles.ticks} aria-label="Designs">
          {SHOP_HERO_SLIDES.map((entry, slideIndex) => {
            const current = slideIndex === index;
            return (
              <button
                key={entry.id}
                type="button"
                aria-current={current ? 'true' : undefined}
                aria-label={`${entry.name}. ${entry.pieces}`}
                className={[styles.tick, current ? styles.tickCurrent : null]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => goTo(slideIndex)}
              >
                <span className={styles.tickName}>{entry.name}</span>
                {current && !reduced && !paused ? (
                  <span
                    key={index}
                    className={styles.tickFill}
                    style={{animationDuration: `${SHOP_HERO_SLIDE_MS}ms`}}
                  />
                ) : (
                  <span
                    className={
                      current ? styles.tickLineCurrent : styles.tickLine
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
