import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {Reveal} from '~/components/motion/Reveal';
import styles from './ProductRow.module.css';

export type ProductRowProps = {
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
  ctaTo?: string;
  children?: ReactNode;
  emptyLabel?: string;
  className?: string;
};

/**
 * Horizontal product strip for homepage and collection introductions.
 */
export function ProductRow({
  eyebrow = 'Shop',
  title = 'Afterstate 001',
  ctaLabel = 'View all',
  ctaTo = '/shop',
  children,
  emptyLabel = 'Products from Afterstate 001 will appear here.',
  className,
}: ProductRowProps) {
  const hasChildren = Boolean(children);

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="product-row-title"
    >
      <Reveal as="header" className={styles.header}>
        <div>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 id="product-row-title" className={styles.title}>
            {title}
          </h2>
        </div>
        {ctaLabel && ctaTo ? (
          <Link to={ctaTo} className={styles.cta} prefetch="intent">
            {ctaLabel}
          </Link>
        ) : null}
      </Reveal>
      <Reveal delayMs={80} className={styles.grid}>
        {hasChildren ? (
          children
        ) : (
          <p className={styles.empty}>{emptyLabel}</p>
        )}
      </Reveal>
    </section>
  );
}
