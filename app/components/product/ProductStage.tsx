import {useCallback, useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {Image} from '@shopify/hydrogen';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import type {ProductStageStill} from '~/lib/product-stage-media';
import styles from './ProductStage.module.css';

export type ProductStageProps = {
  stills: ProductStageStill[];
  crumbs?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Full-bleed 16:9 product stage. Mockups fill the frame; purchase blocks float over them.
 */
export function ProductStage({
  stills,
  crumbs,
  children,
  className,
}: ProductStageProps) {
  const labelId = useId();
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = stills;
  const count = items.length;
  const stillKey = items.map((still) => still.id).join('|');

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(Math.max(next, 0), Math.max(count - 1, 0)));
  }, [count]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncActiveFromScroll, {passive: true});
    return () => el.removeEventListener('scroll', syncActiveFromScroll);
  }, [syncActiveFromScroll]);

  useEffect(() => {
    setActiveIndex(0);
    scrollerRef.current?.scrollTo({left: 0});
  }, [stillKey]);

  useEffect(() => {
    const film = filmRef.current;
    const thumb = film?.querySelector<HTMLElement>(
      `[data-thumb="${activeIndex}"]`,
    );
    if (!film || !thumb) return;
    const left = thumb.offsetLeft - film.clientWidth / 2 + thumb.clientWidth / 2;
    film.scrollTo({left, behavior: reduced ? 'auto' : 'smooth'});
  }, [activeIndex, reduced]);

  const scrollTo = (index: number) => {
    const el = scrollerRef.current;
    const next = ((index % Math.max(count, 1)) + Math.max(count, 1)) % Math.max(count, 1);
    if (!el) {
      setActiveIndex(next);
      return;
    }
    el.scrollTo({
      left: next * el.clientWidth,
      behavior: reduced ? 'auto' : 'smooth',
    });
    setActiveIndex(next);
  };

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={labelId}
    >
      {crumbs ? <div className={styles.crumbs}>{crumbs}</div> : null}

      <div
        className={styles.viewport}
        tabIndex={count > 1 ? 0 : undefined}
        aria-roledescription={count > 1 ? 'carousel' : undefined}
        onKeyDown={(event) => {
          if (count < 2) return;
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollTo(activeIndex + 1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollTo(activeIndex - 1);
          }
        }}
      >
        <p id={labelId} className={styles.srOnly}>
          Product imagery
        </p>

        <div ref={scrollerRef} className={styles.stage}>
          {items.length ? (
            items.map((still, index) => (
              <div key={still.id} className={styles.slide}>
                <StageImage still={still} active={index === activeIndex} priority={index === 0} />
              </div>
            ))
          ) : (
            <div className={styles.slide}>
              <div className={styles.empty} />
            </div>
          )}
        </div>

        <div className={styles.veil} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />

        {count > 1 ? (
          <div className={styles.chrome}>
            <p className={styles.counter} aria-live="polite">
              {String(activeIndex + 1).padStart(2, '0')}
              <span aria-hidden="true"> / </span>
              {String(count).padStart(2, '0')}
            </p>
            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Previous image"
                onClick={() => scrollTo(activeIndex - 1)}
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Next image"
                onClick={() => scrollTo(activeIndex + 1)}
              >
                ›
              </button>
            </div>
          </div>
        ) : null}

        {count > 1 ? (
          <div className={styles.dots} role="group" aria-label="Mockups">
            {items.map((still, index) => (
              <button
                key={still.id}
                type="button"
                className={[
                  styles.dot,
                  index === activeIndex ? styles.dotCurrent : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        ) : null}

        {count > 1 ? (
          <div
            ref={filmRef}
            className={styles.film}
            role="group"
            aria-label="More angles"
          >
            {items.map((still, index) => (
              <button
                key={still.id}
                type="button"
                data-thumb={index}
                className={[
                  styles.thumb,
                  index === activeIndex ? styles.thumbSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => scrollTo(index)}
              >
                <img
                  src={still.url}
                  alt=""
                  width={160}
                  height={90}
                  className={styles.thumbImage}
                  style={
                    still.objectPosition
                      ? {objectPosition: still.objectPosition}
                      : undefined
                  }
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.overlay}>
        <div className={styles.float}>{children}</div>
      </div>
    </section>
  );
}

function isShopifyCdn(url: string) {
  return /cdn\.shopify\.com|shopifycdn\.net/i.test(url);
}

function StageImage({
  still,
  active,
  priority,
}: {
  still: ProductStageStill;
  active: boolean;
  priority: boolean;
}) {
  const className = still.fit === 'contain' ? styles.imageContain : styles.image;
  const style = still.objectPosition
    ? {objectPosition: still.objectPosition}
    : undefined;
  const alt = active ? still.alt : '';

  if (isShopifyCdn(still.url)) {
    return (
      <Image
        data={{
          url: still.url,
          altText: still.alt,
          width: still.width ?? 1600,
          height: still.height ?? 900,
        }}
        alt={alt}
        aspectRatio="16/9"
        className={className}
        style={style}
        sizes="100vw"
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <img
      className={className}
      src={still.url}
      alt={alt}
      width={still.width ?? 1600}
      height={still.height ?? 900}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'low'}
      draggable={false}
    />
  );
}
