import {NavLink} from 'react-router';
import {BrandLogo} from '~/components/brand/BrandLogo';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {
  MAIN_NAV_ITEMS,
  type MainNavItem,
} from '~/components/layout/MainNavigation';
import styles from './MobileNavigation.module.css';

type MobileNavigationProps = {
  items?: MainNavItem[];
  onNavigate?: () => void;
  className?: string;
};

/**
 * Full-height mobile navigation list used inside the mobile aside.
 */
export function MobileNavigation({
  items = MAIN_NAV_ITEMS,
  onNavigate,
  className,
}: MobileNavigationProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Mobile"
    >
      <div className={styles.brand}>
        <BrandLogo size="lg" />
        <p className={styles.brandName}>Afterstate</p>
      </div>
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
