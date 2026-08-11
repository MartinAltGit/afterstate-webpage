import {useEffect, useRef, useState} from 'react';
import heroOriginal from '~/assets/mockups/hero-campaign.jpg';
import heroHoodies from '~/assets/mockups/hero-campaign-hoodies.jpg';
import heroCaps from '~/assets/mockups/hero-campaign-caps.jpg';
import heroWallart from '~/assets/mockups/hero-campaign-wallart.jpg';
import {MagneticLink} from '~/components/motion/MagneticLink';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './LandingHero.module.css';

const HERO_SLIDES = [
  {src: heroOriginal, alt: 'Afterstate campaign look — teal hoodie, peach tee, mustard cap'},
  {src: heroHoodies, alt: 'Afterstate hoodies — charcoal and burgundy limited drop'},
  {src: heroCaps, alt: 'Afterstate tees and caps — sage, mauve, and mustard'},
  {src: heroWallart, alt: 'Afterstate wall art and slate hoodie campaign'},
] as const;

const SLIDE_COUNT = HERO_SLIDES.length;
const SLIDE_MS = 5000;

export type LandingHeroProps = {
  tagline?: string;
  support?: string;
  ctaLabel?: string;
  ctaTo?: string;
  className?: string;
};

/**
 * Full-bleed cinematic opener — campaign media under line + CTA.
 * Punchy directional slide with scale depth between product looks.
 */
export function LandingHero({
  tagline = 'Life beyond the rush.',
  support = 'Limited editions only — short runs, clear intent, clothes made to stay.',
  ctaLabel = 'Shop the drop',
  ctaTo = '/collections',
  className,
}: LandingHeroProps) {
  const localePrefix = useLocalePathPrefix();
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (reduced) return;
    const media = mediaRef.current;
    if (!media) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = media.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, -rect.top / Math.max(rect.height, 1)),
        );
        media.style.setProperty('--parallax', `${progress * 8}%`);
        media.style.setProperty('--veil', `${0.35 + progress * 0.25}`);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  const advanceTo = (next: number) => {
    if (lockedRef.current || next === activeRef.current) return;
    lockedRef.current = true;
    setOutgoing(activeRef.current);
    activeRef.current = next;
    setActive(next);
  };

  useEffect(() => {
    if (outgoing === null) return;
    const unlock = window.setTimeout(() => {
      setOutgoing(null);
      lockedRef.current = false;
    }, 950);
    return () => window.clearTimeout(unlock);
  }, [outgoing, active]);

  useEffect(() => {
    if (SLIDE_COUNT < 2) return;

    const id = window.setInterval(() => {
      const next = (activeRef.current + 1) % SLIDE_COUNT;
      advanceTo(next);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, []);

  const onEnterEnd = (index: number) => {
    if (index !== activeRef.current) return;
    setOutgoing(null);
    lockedRef.current = false;
  };

  return (
    <header className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.media} ref={mediaRef} aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === active;
          const isOutgoing = index === outgoing;

          const stateClass = isActive
            ? outgoing === null
              ? styles.imageIdle
              : styles.imageEnter
            : isOutgoing
              ? styles.imageExit
              : styles.imageHidden;

          return (
            <img
              key={slide.alt}
              className={[styles.image, stateClass].join(' ')}
              src={slide.src}
              alt=""
              width={2048}
              height={1152}
              decoding={index === 0 ? 'sync' : 'async'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              onAnimationEnd={(event) => {
                if (event.target !== event.currentTarget) return;
                if (isActive) onEnterEnd(index);
              }}
            />
          );
        })}
        <div
          className={[
            styles.flash,
            outgoing !== null ? styles.flashFire : '',
          ]
            .filter(Boolean)
            .join(' ')}
          key={outgoing === null ? 'flash-idle' : `flash-${active}`}
        />
        <div
          className={[
            styles.swipe,
            outgoing !== null ? styles.swipeFire : '',
          ]
            .filter(Boolean)
            .join(' ')}
          key={outgoing === null ? 'swipe-idle' : `swipe-${active}`}
        />
        <div className={styles.veil} />
        <div className={styles.grain} />
      </div>

      <div className={styles.inner}>
        <h1 className={styles.tagline}>{tagline}</h1>
        <p className={styles.support}>{support}</p>
        {ctaLabel && ctaTo ? (
          <MagneticLink
            className={styles.cta}
            variant="ghost"
            to={prefixPathWithLocale(ctaTo, localePrefix)}
          >
            {ctaLabel}
          </MagneticLink>
        ) : null}
      </div>

      <div
        className={styles.dots}
        role="tablist"
        aria-label="Campaign looks"
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.alt}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={slide.alt}
            className={[
              styles.dot,
              index === active ? styles.dotActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => advanceTo(index)}
          />
        ))}
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </header>
  );
}
