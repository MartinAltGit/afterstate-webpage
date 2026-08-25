import {useEffect, useRef, useState} from 'react';
import heroOriginal from '~/assets/mockups/hero-campaign.jpg';
import heroOriginalMobile from '~/assets/mockups/hero-campaign-mobile.jpg';
import heroHoodies from '~/assets/mockups/hero-campaign-hoodies.jpg';
import heroHoodiesMobile from '~/assets/mockups/hero-campaign-hoodies-mobile.jpg';
import heroCaps from '~/assets/mockups/hero-campaign-caps.jpg';
import heroCapsMobile from '~/assets/mockups/hero-campaign-caps-mobile.jpg';
import heroWallart from '~/assets/mockups/hero-campaign-wallart.jpg';
import heroWallartMobile from '~/assets/mockups/hero-campaign-wallart-mobile.jpg';
import {MagneticLink} from '~/components/motion/MagneticLink';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {useUiCopy} from '~/lib/ui-copy';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './LandingHero.module.css';

const HERO_SLIDES = [
  {
    src: heroOriginal,
    mobileSrc: heroOriginalMobile,
    alt: 'Afterstate No Rush — sage tee, cream crew, and forest cap',
  },
  {
    src: heroHoodies,
    mobileSrc: heroHoodiesMobile,
    alt: 'Afterstate Not Yet — navy tee, burgundy crew, and navy cap',
  },
  {
    src: heroCaps,
    mobileSrc: heroCapsMobile,
    alt: 'Afterstate Say Less — brick tee, navy hoodie, and burgundy cap',
  },
  {
    src: heroWallart,
    mobileSrc: heroWallartMobile,
    alt: 'Afterstate After This — forest hoodie, cream tee, and bone cap',
  },
] as const;

const SLIDE_COUNT = HERO_SLIDES.length;
const SLIDE_MS = 5000;

export type LandingHeroProps = {
  eyebrow?: string;
  tagline?: string;
  accent?: string;
  support?: string;
  ctaLabel?: string;
  ctaTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  className?: string;
};

/**
 * Full-bleed cinematic opener — campaign media, line, two clear CTAs.
 */
export function LandingHero({
  eyebrow = 'Afterstate 001',
  tagline,
  accent,
  support,
  ctaLabel,
  ctaTo = '/shop',
  secondaryLabel,
  secondaryTo = '/journal',
  className,
}: LandingHeroProps) {
  const copy = useUiCopy();
  const resolvedTagline = tagline ?? copy.hero.tagline;
  const resolvedAccent = accent ?? copy.hero.accent;
  const resolvedSupport = support ?? copy.hero.support;
  const resolvedCta = ctaLabel ?? copy.hero.shopCta;
  const resolvedSecondary = secondaryLabel ?? copy.hero.journalCta;
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
      <div
        className={styles.media}
        ref={mediaRef}
        aria-hidden="true"
        data-slideshow="hero"
      >
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
            <picture key={slide.alt} className={styles.picture}>
              <source
                media="(min-width: 45em)"
                srcSet={slide.src}
                width={2048}
                height={1152}
              />
              <img
                className={[styles.image, stateClass].join(' ')}
                src={slide.mobileSrc}
                alt=""
                width={1536}
                height={2752}
                decoding={index === 0 ? 'sync' : 'async'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                onAnimationEnd={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (isActive) onEnterEnd(index);
                }}
              />
            </picture>
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
        {eyebrow ? <p className={styles.brand}>{eyebrow}</p> : null}
        <h1 className={styles.tagline}>
          {resolvedTagline}{' '}
          {resolvedAccent ? (
            <span className={styles.accent}>{resolvedAccent}</span>
          ) : null}
        </h1>
        <p className={styles.support}>{resolvedSupport}</p>
        <div className={styles.actions}>
          {resolvedCta && ctaTo ? (
            <MagneticLink
              className={styles.cta}
              variant="bright"
              to={prefixPathWithLocale(ctaTo, localePrefix)}
            >
              {resolvedCta}
            </MagneticLink>
          ) : null}
          {resolvedSecondary && secondaryTo ? (
            <MagneticLink
              className={styles.ctaSecondary}
              variant="ghost"
              to={prefixPathWithLocale(secondaryTo, localePrefix)}
            >
              {resolvedSecondary}
            </MagneticLink>
          ) : null}
        </div>
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
        <span className={styles.scrollLabel}>{copy.hero.scroll}</span>
      </div>
    </header>
  );
}
