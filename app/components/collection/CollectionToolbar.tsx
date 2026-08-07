import styles from './CollectionToolbar.module.css';

export type CollectionToolbarProps = {
  productCount?: number;
  children?: React.ReactNode;
  filtersSlot?: React.ReactNode;
  className?: string;
};

/**
 * Collection toolbar — count + filter/sort controls slot.
 */
export function CollectionToolbar({
  productCount,
  children,
  filtersSlot,
  className,
}: CollectionToolbarProps) {
  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Collection tools"
    >
      <div className={styles.meta}>
        {typeof productCount === 'number' ? (
          <p className={styles.count}>
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
        ) : null}
        {children}
      </div>
      {filtersSlot ? <div className={styles.filters}>{filtersSlot}</div> : null}
    </div>
  );
}
