import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Hierarchical breadcrumb trail for collection and product pages.
 */
export function Breadcrumbs({items, className}: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Breadcrumb"
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.to ? `${item.to}:${item.label}` : item.label} className={styles.item}>
              {index > 0 ? (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              ) : null}
              {item.to && !isLast ? (
                <LocaleAwareLink className={styles.link} to={item.to} prefetch="intent">
                  {item.label}
                </LocaleAwareLink>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
