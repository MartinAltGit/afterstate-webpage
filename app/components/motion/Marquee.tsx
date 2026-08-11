import {useEffect, useRef, useState} from 'react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './Marquee.module.css';

export type MarqueeProps = {
  items?: string[];
  className?: string;
};

const DEFAULT_ITEMS = [
  'Afterstate',
  'Life beyond the rush',
  'Limited edition',
  'No restocks',
  'Short runs',
];

/**
 * Editorial ticker — reveals whenever it enters view, then loops horizontally.
 */
export function Marquee({items = DEFAULT_ITEMS, className}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const sequence = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    if (reduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(Boolean(entry?.isIntersecting));
      },
      {threshold: 0.1, rootMargin: '0px 0px -4% 0px'},
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={[
        styles.root,
        visible ? styles.visible : styles.pending,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <div
        className={[styles.track, !reduced ? styles.trackScroll : null]
          .filter(Boolean)
          .join(' ')}
      >
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className={styles.item}>
            {item}
            <span className={styles.sep} aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
