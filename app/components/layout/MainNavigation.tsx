import {NavLink} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {navLabelForPath, useUiCopy} from '~/lib/ui-copy';
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
];

/** Desktop left cluster — Journal sits with the utility chrome beside the market selector. */
export const PRIMARY_NAV_ITEMS: MainNavItem[] = MAIN_NAV_ITEMS.filter(
  (item) => item.label !== 'Journal',
);

export const JOURNAL_NAV_ITEM: MainNavItem = {
  label: 'Journal',
  to: '/journal',
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
  const copy = useUiCopy();

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={copy.a11y.primary}
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
              end={item.to === '/'}
              onClick={onNavigate}
              prefetch="intent"
              to={prefixPathWithLocale(item.to, localePrefix)}
            >
              {navLabelForPath(item.to, copy)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
