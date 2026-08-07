import styles from './CollectionManifesto.module.css';

export type CollectionManifestoProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Editorial manifesto block beneath collection hero.
 */
export function CollectionManifesto({
  title,
  children,
  className,
}: CollectionManifestoProps) {
  if (!children) return null;

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={title || 'Collection manifesto'}
    >
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
