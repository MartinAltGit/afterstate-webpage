import {NavLink} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './CollectionNavigation.module.css';

export type CollectionNavItem = {
  label: string;
  to: string;
};

type CollectionNavigationProps = {
  items?: CollectionNavItem[];
  className?: string;
};

const DEFAULT_ITEMS: CollectionNavItem[] = [
  {label: 'All', to: '/collections/all'},
  {label: 'Afterstate 001', to: '/afterstate-001-no-rush'},
  {label: 'Essentials', to: '/collections/essentials'},
];

/**
 * Secondary nav for browsing Afterstate collections.
 */
export function CollectionNavigation({
  items = DEFAULT_ITEMS,
  className,
}: CollectionNavigationProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Collections"
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              className={({isActive}) =>
                [styles.link, isActive ? styles.active : null]
                  .filter(Boolean)
                  .join(' ')
              }
              end
              prefetch="intent"
              to={prefixPathWithLocale(item.to, localePrefix)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
