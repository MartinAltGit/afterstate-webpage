import {Form, NavLink} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './AccountNavigation.module.css';

export type AccountNavItem = {
  label: string;
  to: string;
};

type AccountNavigationProps = {
  items?: AccountNavItem[];
  className?: string;
  showLogout?: boolean;
};

const DEFAULT_ITEMS: AccountNavItem[] = [
  {label: 'Orders', to: '/account/orders'},
  {label: 'Profile', to: '/account/profile'},
  {label: 'Addresses', to: '/account/addresses'},
];

/**
 * Account area secondary navigation with optional logout action.
 */
export function AccountNavigation({
  items = DEFAULT_ITEMS,
  className,
  showLogout = true,
}: AccountNavigationProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Account"
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
        {showLogout ? (
          <li>
            <Form
              method="POST"
              action={prefixPathWithLocale('/account/logout', localePrefix)}
            >
              <button className={styles.logout} type="submit">
                Sign out
              </button>
            </Form>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
