import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {ProductMedia, type ProductMediaItem} from './ProductMedia';
import styles from './ProductGallery.module.css';

export type ProductGalleryProps = {
  media: ProductMediaItem[];
  className?: string;
};

function isImageMedia(item: ProductMediaItem): boolean {
  return item.mediaContentType === 'IMAGE';
}

/**
 * One cinematic frame + a horizontal thumbnail filmstrip underneath.
 * Swipe the main image on phone; click thumbs anywhere.
 */
export function ProductGallery({media, className}: ProductGalleryProps) {
  const labelId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = media.length > 0 ? media : [];
  const count = items.length;

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
    const film = filmRef.current;
    const thumb = film?.querySelector<HTMLElement>(`[data-thumb="${activeIndex}"]`);
    if (!film || !thumb) return;
    const left = thumb.offsetLeft - film.clientWidth / 2 + thumb.clientWidth / 2;
    film.scrollTo({left, behavior: 'smooth'});
  }, [activeIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxIndex == null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex == null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setLightboxIndex((i) => (i == null ? i : (i + 1) % count));
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i == null ? i : (i - 1 + count) % count));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, count]);

  const scrollTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) {
      setActiveIndex(index);
      return;
    }
    el.scrollTo({left: index * el.clientWidth, behavior: 'smooth'});
    setActiveIndex(index);
  };

  const openLightbox = (index: number) => {
    if (!isImageMedia(items[index])) return;
    setLightboxIndex(index);
  };

  const lightboxItem = lightboxIndex != null ? items[lightboxIndex] : null;

  if (!items[0]) {
    return (
      <div
        className={[styles.root, className].filter(Boolean).join(' ')}
        aria-label="Product gallery"
      >
        <div className={styles.empty} />
      </div>
    );
  }

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={labelId}
    >
      <p id={labelId} className={styles.srOnly}>
        Product gallery
      </p>

      <div className={styles.stageWrap}>
        <div ref={scrollerRef} className={styles.stage}>
          {items.map((item, index) => {
            const image = isImageMedia(item);
            return (
              <div key={item.id} className={styles.slide}>
                {image ? (
                  <button
                    type="button"
                    className={styles.slideButton}
                    onClick={() => openLightbox(index)}
                    aria-label={`View image ${index + 1} of ${count}, larger`}
                  >
                    <ProductMedia
                      media={item}
                      priority={index === 0}
                      sizes="(min-width: 64em) 55vw, 100vw"
                      fill
                    />
                  </button>
                ) : (
                  <ProductMedia
                    media={item}
                    priority={index === 0}
                    sizes="(min-width: 64em) 55vw, 100vw"
                    fill
                  />
                )}
              </div>
            );
          })}
        </div>

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
                onClick={() => scrollTo((activeIndex - 1 + count) % count)}
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Next image"
                onClick={() => scrollTo((activeIndex + 1) % count)}
              >
                ›
              </button>
            </div>
          </div>
        ) : null}

        {count > 1 ? (
          <div
            ref={filmRef}
            className={styles.film}
            role="group"
            aria-label="More angles"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
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
                <ProductMedia
                  media={item}
                  priority={index < 6}
                  sizes="96px"
                  compact
                  className={styles.thumbMedia}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label="Product image"
        onClose={() => setLightboxIndex(null)}
      >
        {lightboxItem ? (
          <div className={styles.lightboxInner}>
            <button
              type="button"
              className={styles.lightboxScrim}
              aria-label="Close image"
              onClick={() => setLightboxIndex(null)}
            />
            <ProductMedia
              media={lightboxItem}
              priority
              sizes="100vw"
              unconstrained
              className={styles.lightboxMedia}
            />
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setLightboxIndex(null)}
            >
              Close
            </button>
            {count > 1 ? (
              <>
                <button
                  type="button"
                  className={styles.lightboxPrev}
                  aria-label="Previous image"
                  onClick={() =>
                    setLightboxIndex((i) =>
                      i == null ? 0 : (i - 1 + count) % count,
                    )
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={styles.lightboxNext}
                  aria-label="Next image"
                  onClick={() =>
                    setLightboxIndex((i) => (i == null ? 0 : (i + 1) % count))
                  }
                >
                  ›
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
