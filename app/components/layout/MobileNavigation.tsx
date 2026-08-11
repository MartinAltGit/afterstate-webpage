import {Suspense, type ReactNode} from 'react';
import {Await, NavLink} from 'react-router';
import {BrandLogo} from '~/components/brand/BrandLogo';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {
  MAIN_NAV_ITEMS,
  type MainNavItem,
} from '~/components/layout/MainNavigation';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './MobileNavigation.module.css';

type MobileNavigationProps = {
  items?: MainNavItem[];
  onNavigate?: () => void;
  className?: string;
  isLoggedIn?: Promise<boolean>;
  marketSelector?: ReactNode;
};

/**
 * Full-height mobile navigation — account + language, links, then socials + mark.
 */
export function MobileNavigation({
  items = MAIN_NAV_ITEMS,
  onNavigate,
  className,
  isLoggedIn,
  marketSelector,
}: MobileNavigationProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Mobile"
    >
      <div className={styles.top}>
        <div className={styles.accountRow}>
          <AccountRow isLoggedIn={isLoggedIn} onNavigate={onNavigate} />
          {marketSelector ? (
            <div className={styles.languageControl}>{marketSelector}</div>
          ) : null}
        </div>
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

      <div className={styles.bottom}>
        <LocaleAwareLink
          className={styles.logoLink}
          prefetch="intent"
          to="/"
          onClick={onNavigate}
          aria-label="Afterstate home"
        >
          <BrandLogo variant="wordmark" size="md" />
        </LocaleAwareLink>

        <ul className={styles.socials} aria-label="Connect">
          <li>
            <a
              className={styles.socialLink}
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a
              className={styles.socialLink}
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
          </li>
          <li>
            <LocaleAwareLink
              className={styles.socialLink}
              prefetch="intent"
              to="/contact"
              onClick={onNavigate}
              aria-label="Contact"
            >
              <MailIcon />
            </LocaleAwareLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function AccountRow({
  isLoggedIn,
  onNavigate,
}: {
  isLoggedIn?: Promise<boolean>;
  onNavigate?: () => void;
}) {
  return (
    <LocaleAwareLink
      className={styles.account}
      prefetch="intent"
      to="/account"
      onClick={onNavigate}
    >
      <span className={styles.accountIcon} aria-hidden="true">
        <ProfileIcon />
      </span>
      {isLoggedIn ? (
        <Suspense fallback={<span className={styles.accountLabel}>Account</span>}>
          <Await
            resolve={isLoggedIn}
            errorElement={<span className={styles.accountLabel}>Account</span>}
          >
            {(loggedIn) => (
              <span className={styles.accountLabel}>
                {loggedIn ? 'Account' : 'Sign in'}
              </span>
            )}
          </Await>
        </Suspense>
      ) : (
        <span className={styles.accountLabel}>Account</span>
      )}
    </LocaleAwareLink>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 19.25c1.6-3.1 3.9-4.5 6.5-4.5s4.9 1.4 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.25" cy="6.75" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8.5H16.5V5.5H14.5C12.57 5.5 11 7.07 11 9V11H9V14H11V20.5H14V14H16.2L16.7 11H14V9C14 8.72 14.22 8.5 14.5 8.5Z"
        fill="currentColor"
      />
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 7.5 12 13l7.5-5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
