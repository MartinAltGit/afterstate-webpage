import {Suspense, type ReactNode} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {BrandLogo} from '~/components/brand/BrandLogo';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {
  ABOUT_NAV_ITEM,
  BLOG_NAV_ITEM,
  MainNavigation,
  PRIMARY_NAV_ITEMS,
} from '~/components/layout/MainNavigation';
import {VisuallyHidden} from '~/components/primitives/VisuallyHidden';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './SiteHeader.module.css';

type SiteHeaderProps = {
  cart: Promise<CartApiQueryFragment | null>;
  /** Kept for layout compatibility; account entry points are hidden for now. */
  isLoggedIn?: Promise<boolean>;
  marketSelector?: ReactNode;
  className?: string;
};

/**
 * Floating nav — logo centered, chrome on the sides.
 * Sign-in is omitted: email capture covers newsletter / demand without Customer Accounts.
 */
export function SiteHeader({
  cart,
  marketSelector,
  className,
}: SiteHeaderProps) {
  const localePrefix = useLocalePathPrefix();

  return (
    <header className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.float}>
        <div className={styles.leading}>
          <MobileMenuToggle />
          <MainNavigation items={PRIMARY_NAV_ITEMS} className={styles.nav} />
        </div>

        <LocaleAwareLink
          className={styles.logoLink}
          prefetch="intent"
          to="/"
          aria-label="Afterstate home"
        >
          <BrandLogo variant="wordmark" size="md" />
        </LocaleAwareLink>

        <div className={styles.actions}>
          <NavLink
            className={({isActive}) =>
              [styles.utilityLink, isActive ? styles.utilityActive : null]
                .filter(Boolean)
                .join(' ')
            }
            end
            prefetch="intent"
            to={prefixPathWithLocale(ABOUT_NAV_ITEM.to, localePrefix)}
          >
            {ABOUT_NAV_ITEM.label}
          </NavLink>
          <NavLink
            className={({isActive}) =>
              [styles.utilityLink, isActive ? styles.utilityActive : null]
                .filter(Boolean)
                .join(' ')
            }
            end
            prefetch="intent"
            to={prefixPathWithLocale(BLOG_NAV_ITEM.to, localePrefix)}
          >
            {BLOG_NAV_ITEM.label}
          </NavLink>
          {marketSelector ? (
            <div className={[styles.market, styles.desktopOnly].join(' ')}>
              {marketSelector}
            </div>
          ) : null}
          <CartToggle cart={cart} />
        </div>
      </div>
    </header>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <span className={styles.menuGlyph} aria-hidden="true" />
      <VisuallyHidden>Menu</VisuallyHidden>
    </button>
  );
}

function CartToggle({cart}: Pick<SiteHeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: typeof window !== 'undefined' ? window.location.href : '',
        } as CartViewPayload);
      }}
    >
      <BagIcon />
      {count > 0 ? (
        <span className={styles.cartCount} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function BagIcon() {
  return (
    <svg
      className={styles.glyph}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 9V7.5a5 5 0 0 1 10 0V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 9h11l.8 11.2a1.5 1.5 0 0 1-1.5 1.6H7.2a1.5 1.5 0 0 1-1.5-1.6L6.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
