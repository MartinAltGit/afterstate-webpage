import {useRef, type CSSProperties, type MouseEvent} from 'react';
import lookbook01 from '~/assets/mockups/lookbook-01.jpg';
import lookbook02 from '~/assets/mockups/lookbook-02.jpg';
import lookbook03 from '~/assets/mockups/lookbook-03.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {Reveal} from '~/components/motion/Reveal';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './StreetwearMockups.module.css';

type MockupItem = {
  id: string;
  index: string;
  label: string;
  detail: string;
  cta: string;
  to: string;
  tone: 'teal' | 'coral' | 'mustard';
  src: string;
  alt: string;
};

const MOCKUPS: MockupItem[] = [
  {
    id: 'look-01',
    index: '01',
    label: 'Everyday',
    detail: 'All day. No rush.',
    cta: 'Shop',
    to: '/shop',
    tone: 'teal',
    src: lookbook01,
    alt: 'Model in Afterstate muted teal outerwear with AS logo',
  },
  {
    id: 'look-02',
    index: '02',
    label: 'The drop',
    detail: '001 · No Rush',
    cta: 'See the drop',
    to: '/collections/afterstate-001',
    tone: 'coral',
    src: lookbook02,
    alt: 'Model in Afterstate oversized black jacket with AS logo',
  },
  {
    id: 'look-03',
    index: '03',
    label: 'Journal',
    detail: 'Notes from the brand',
    cta: 'Read',
    to: '/journal',
    tone: 'mustard',
    src: lookbook03,
    alt: 'Two models in Afterstate sage shirts with AS logo',
  },
];

export type StreetwearMockupsProps = {
  eyebrow?: string;
  title?: string;
  accent?: string;
  className?: string;
};

function ChapterCard({
  item,
  index,
}: {
  item: MockupItem;
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
    <Reveal
      as="li"
      delayMs={index * 90}
      className={[styles.item, styles[item.tone]].join(' ')}
    >
      <article
        ref={cardRef}
        className={styles.card}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={
          {
            '--shine-x': '50%',
            '--shine-y': '40%',
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
                width={900}
                height={1200}
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
 * Shoppable lifestyle chapters under the hero.
 */
export function StreetwearMockups({
  eyebrow = 'The wardrobe',
  title = 'Not just clothes.',
  accent = 'A slower pace.',
  className,
}: StreetwearMockupsProps) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="streetwear-title"
    >
      <Reveal as="header" className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 id="streetwear-title" className={styles.title}>
          {title}
          {accent ? (
            <>
              {' '}
              <span className={styles.accent}>{accent}</span>
            </>
          ) : null}
        </h2>
        <p className={styles.lede}>
          Three ways in — the catalog, the current drop, and the journal.
        </p>
      </Reveal>

      <ul className={styles.grid} aria-label="Wardrobe chapters">
        {MOCKUPS.map((item, index) => (
          <ChapterCard key={item.id} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}
