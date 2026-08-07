import {NavLink} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './MainNavigation.module.css';

export type MainNavItem = {
  label: string;
  to: string;
};

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {label: 'Shop', to: '/collections/all'},
  {label: 'Collections', to: '/collections'},
  {label: 'Journal', to: '/blogs/journal'},
  {label: 'About', to: '/pages/about'},
];

type MainNavigationProps = {
  items?: MainNavItem[];
  className?: string;
  onNavigate?: () => void;
};

/**
 * Primary desktop navigation for Afterstate.
 */
export function MainNavigation({
  items = MAIN_NAV_ITEMS,
  className,
  onNavigate,
}: MainNavigationProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Primary"
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
              onClick={onNavigate}
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
