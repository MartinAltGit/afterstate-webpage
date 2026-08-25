import {useRef, type CSSProperties, type MouseEvent} from 'react';
import afterThisCapWorn from '~/assets/mockups/product-stage/after-this-cap/worn.jpg';
import noRushTeeWorn from '~/assets/mockups/product-stage/no-rush-t-shirt/worn.jpg';
import sayLessHoodieWorn from '~/assets/mockups/product-stage/say-less-hoodie/worn.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {Reveal} from '~/components/motion/Reveal';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {useUiCopy} from '~/lib/ui-copy';
import {shopCatalogSearch} from '~/lib/shop-catalog';
import styles from './StreetwearMockups.module.css';

const MOCKUP_MEDIA = [
  {
    id: 'tees',
    index: '01',
    to: `/shop${shopCatalogSearch('tee')}`,
    objectPosition: '58% 18%',
    src: noRushTeeWorn,
    alt: 'Woman mid-turn in the sage No Rush tee against dark stone.',
  },
  {
    id: 'hoodies',
    index: '02',
    to: `/shop${shopCatalogSearch('hoodie')}`,
    objectPosition: '48% 16%',
    src: sayLessHoodieWorn,
    alt: 'Woman in the navy Say Less hoodie against a dark stone wall.',
  },
  {
    id: 'caps',
    index: '03',
    to: `/shop${shopCatalogSearch('cap')}`,
    objectPosition: '28% 18%',
    src: afterThisCapWorn,
    alt: 'Woman looking back in the bone After This cap against dark stone.',
  },
] as const;

export type StreetwearMockupsProps = {
  eyebrow?: string;
  title?: string;
  accent?: string;
  className?: string;
};

type ChapterItem = (typeof MOCKUP_MEDIA)[number] & {
  label: string;
  detail: string;
  cta: string;
};

function ChapterCard({
  item,
  index,
}: {
  item: ChapterItem;
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

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
    cardRef.current.style.setProperty('--shine-x', '50%');
    cardRef.current.style.setProperty('--shine-y', '40%');
  };

  return (
    <Reveal as="li" delayMs={index * 90} className={styles.item}>
      <article
        ref={cardRef}
        className={styles.card}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={
          {
            '--shine-x': '50%',
            '--shine-y': '40%',
            '--object-pos': item.objectPosition,
          } as CSSProperties
        }
      >
        <LocaleAwareLink
          className={styles.link}
          prefetch="intent"
          to={item.to}
        >
          <figure className={styles.figure}>
            <div className={styles.frame}>
              <img
                className={styles.image}
                src={item.src}
                alt={item.alt}
                width={2752}
                height={1536}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.shine} aria-hidden="true" />
              <span className={styles.plate} aria-hidden="true">
                {item.index}
              </span>
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.label}>{item.label}</span>
              <span className={styles.detail}>{item.detail}</span>
              <span className={styles.cta}>
                {item.cta}
                <span aria-hidden="true">→</span>
              </span>
            </figcaption>
          </figure>
        </LocaleAwareLink>
      </article>
    </Reveal>
  );
}

/**
 * Wardrobe chapters — tees, hoodies, caps from the drop stills.
 */
export function StreetwearMockups({
  eyebrow,
  title,
  accent,
  className,
}: StreetwearMockupsProps) {
  const copy = useUiCopy();
  const resolvedEyebrow = eyebrow ?? copy.wardrobe.eyebrow;
  const resolvedTitle = title ?? copy.wardrobe.title;
  const resolvedAccent = accent ?? copy.wardrobe.accent;
  const chapters = MOCKUP_MEDIA.map((media) => {
    const chapter =
      copy.wardrobe.chapters.find((entry) => entry.id === media.id) ??
      copy.wardrobe.chapters[0];
    return {
      ...media,
      label: chapter.label,
      detail: chapter.detail,
      cta: chapter.cta,
    };
  });

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="streetwear-title"
    >
      <Reveal as="header" className={styles.header}>
        {resolvedEyebrow ? (
          <p className={styles.eyebrow}>{resolvedEyebrow}</p>
        ) : null}
        <h2 id="streetwear-title" className={styles.title}>
          {resolvedTitle}
          {resolvedAccent ? (
            <>
              {' '}
              <span className={styles.accent}>{resolvedAccent}</span>
            </>
          ) : null}
        </h2>
        <p className={styles.lede}>{copy.wardrobe.lede}</p>
      </Reveal>

      <ul className={styles.grid} aria-label={copy.wardrobe.aria}>
        {chapters.map((item, index) => (
          <ChapterCard key={item.id} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}
