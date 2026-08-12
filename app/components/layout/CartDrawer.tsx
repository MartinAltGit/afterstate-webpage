import {Await, Link} from 'react-router';
import {Suspense, useId, type ReactNode} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {CartDrawer as CartDrawerBody} from '~/components/commerce/CartDrawer';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {MobileNavigation} from '~/components/layout/MobileNavigation';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';

type CartDrawerProps = {
  cart: Promise<CartApiQueryFragment | null>;
};

/**
 * Cart aside drawer — mounts commerce CartDrawer body inside Aside.
 */
export function CartDrawer({cart}: CartDrawerProps) {
  return (
    <Aside type="cart" heading={<CartAsideHeading cart={cart} />}>
      <Suspense fallback={null}>
        <Await resolve={cart}>
          {(resolved) => <CartDrawerBody cart={resolved} />}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartAsideHeading({cart}: CartDrawerProps) {
  return (
    <Suspense
      fallback={
        <span className="cart-aside-heading">
          <span className="cart-aside-heading__title">Cart</span>
        </span>
      }
    >
      <Await resolve={cart}>
        {(resolved) => {
          const count = resolved?.totalQuantity ?? 0;
          return (
            <span className="cart-aside-heading">
              <span className="cart-aside-heading__title">Cart</span>
              {count > 0 ? (
                <span className="cart-aside-heading__count">{count}</span>
              ) : null}
            </span>
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * Predictive search aside.
 */
export function SearchDrawer() {
  const queriesDatalistId = useId();
  const localePrefix = useLocalePathPrefix();

  return (
    <Aside type="search" heading="Search">
      <div className="predictive-search">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search Afterstate"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              <button type="button" onClick={goToSearch}>
                Search
              </button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading…</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${prefixPathWithLocale(SEARCH_ENDPOINT, localePrefix)}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

type MobileMenuDrawerProps = {
  isLoggedIn?: Promise<boolean>;
  marketSelector?: ReactNode;
};

/**
 * Mobile menu aside using MobileNavigation.
 */
export function MobileMenuDrawer({
  isLoggedIn,
  marketSelector,
}: MobileMenuDrawerProps) {
  const {close} = useAside();

  return (
    <Aside
      type="mobile"
      heading={
        <span className="mobile-menu-heading">
          <span className="mobile-menu-heading__index" aria-hidden="true">
            00
          </span>
          <span className="mobile-menu-heading__title">Index</span>
        </span>
      }
    >
      <MobileNavigation
        onNavigate={close}
        isLoggedIn={isLoggedIn}
        marketSelector={marketSelector}
      />
    </Aside>
  );
}

type DrawersProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: ReactNode;
  isLoggedIn?: Promise<boolean>;
  marketSelector?: ReactNode;
};

/**
 * Convenience wrapper that mounts cart, search, and mobile drawers.
 */
export function SiteDrawers({
  cart,
  children,
  isLoggedIn,
  marketSelector,
}: DrawersProps) {
  return (
    <>
      <CartDrawer cart={cart} />
      <SearchDrawer />
      <MobileMenuDrawer
        isLoggedIn={isLoggedIn}
        marketSelector={marketSelector}
      />
      {children}
    </>
  );
}
