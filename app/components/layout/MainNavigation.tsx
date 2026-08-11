import {NavLink} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './MainNavigation.module.css';

export type MainNavItem = {
  label: string;
  to: string;
};

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {label: 'Home', to: '/'},
  {label: 'Shop', to: '/shop'},
  {label: 'Limited', to: '/collections'},
  {label: 'Journal', to: '/journal'},
  {label: 'About', to: '/about'},
  {label: 'Blog', to: '/blog'},
];

/** Desktop left cluster — About and Blog sit with the utility chrome. */
export const PRIMARY_NAV_ITEMS: MainNavItem[] = MAIN_NAV_ITEMS.filter(
  (item) => item.label !== 'About' && item.label !== 'Blog',
);

export const ABOUT_NAV_ITEM: MainNavItem = {
  label: 'About',
  to: '/about',
};

export const BLOG_NAV_ITEM: MainNavItem = {
  label: 'Blog',
  to: '/blog',
};

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
