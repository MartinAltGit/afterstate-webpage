import styles from './ProductStory.module.css';

export type ProductStoryProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Editorial design-story block for product pages.
 */
export function ProductStory({
  title = 'Design story',
  children,
  className,
}: ProductStoryProps) {
  if (!children) return null;

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={title}
    >
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
