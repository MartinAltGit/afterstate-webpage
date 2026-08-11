import {useRef, type CSSProperties, type MouseEvent} from 'react';
import lookbook01 from '~/assets/mockups/lookbook-01.jpg';
import lookbook02 from '~/assets/mockups/lookbook-02.jpg';
import lookbook03 from '~/assets/mockups/lookbook-03.jpg';
import {Reveal} from '~/components/motion/Reveal';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './StreetwearMockups.module.css';

type MockupItem = {
  id: string;
  label: string;
  detail: string;
  tone: 'teal' | 'coral' | 'mustard';
  src: string;
  alt: string;
};

const MOCKUPS: MockupItem[] = [
  {
    id: 'look-01',
    label: 'City layer',
    detail: 'Muted teal · AS mark',
    tone: 'teal',
    src: lookbook01,
    alt: 'Model in Afterstate muted teal outerwear with AS logo',
  },
  {
    id: 'look-02',
    label: 'Volume',
    detail: 'Black shell · coral under',
    tone: 'coral',
    src: lookbook02,
    alt: 'Model in Afterstate oversized black jacket with AS logo',
  },
  {
    id: 'look-03',
    label: 'Quiet pair',
    detail: 'Sage shirt · twin look',
    tone: 'mustard',
    src: lookbook03,
    alt: 'Two models in Afterstate sage shirts with AS logo',
  },
];

export type StreetwearMockupsProps = {
  eyebrow?: string;
  title?: string;
  className?: string;
};

function TiltCard({
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
    cardRef.current.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
    cardRef.current.style.setProperty('--shine-x', `${50 + x * 40}%`);
    cardRef.current.style.setProperty('--shine-y', `${50 + y * 40}%`);
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
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
            '--tilt-x': '0deg',
            '--tilt-y': '0deg',
            '--shine-x': '50%',
            '--shine-y': '40%',
          } as CSSProperties
        }
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
            <span className={styles.shine} aria-hidden="true" />
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.detail}>{item.detail}</span>
          </figcaption>
        </figure>
      </article>
    </Reveal>
  );
}

/**
 * Interactive lookbook strip for the landing page.
 */
export function StreetwearMockups({
  eyebrow = 'Lookbook',
  title = 'Wear the mark',
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
        </h2>
        <p className={styles.lede}>
          Editorial frames from the Afterstate world — pace, silhouette, and the
          AS mark.
        </p>
      </Reveal>

      <ul className={styles.grid}>
        {MOCKUPS.map((item, index) => (
          <TiltCard key={item.id} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}
