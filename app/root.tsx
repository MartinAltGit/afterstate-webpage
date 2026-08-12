import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  Link,
  Await,
} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import logoPng from '~/assets/logo-afterstate.png';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/layout/PageLayout';
import {PersistStylesheets} from '~/components/layout/PersistStylesheets';
import {WelcomeOffer} from '~/components/layout/WelcomeOffer';
import {NewsletterForm} from '~/components/content/NewsletterForm';
import {NotFoundState} from '~/components/feedback/NotFoundState';
import {ErrorState} from '~/components/feedback/ErrorState';
import {CartBuyerIdentitySync} from '~/components/commerce/CartBuyerIdentitySync';
import type {I18nLocale} from '~/lib/i18n';
import {
  buildDocumentSeoMeta,
  getSiteOrigin,
  htmlLangFromLanguage,
} from '~/lib/seo';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Market / locale prefix changed → refresh i18n + cart currency context
  const currentLocale = currentUrl.pathname.split('/')[1] ?? '';
  const nextLocale = nextUrl.pathname.split('/')[1] ?? '';
  const isLocaleSeg = (seg: string) => /^[a-z]{2}-[a-z]{2}$/i.test(seg);
  const currentPrefix = isLocaleSeg(currentLocale) ? currentLocale.toLowerCase() : '';
  const nextPrefix = isLocaleSeg(nextLocale) ? nextLocale.toLowerCase() : '';
  if (currentPrefix !== nextPrefix) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://api.fontshare.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@500,600&f[]=sentient@400,500&display=swap',
    },

    {rel: 'icon', type: 'image/svg+xml', href: favicon},
    {rel: 'icon', type: 'image/png', href: logoPng},
    {rel: 'apple-touch-icon', href: logoPng},
  ];
}

/**
 * Document-level canonical, hreflang, and utility robots for every route.
 */
export const meta: Route.MetaFunction = ({data, location}) => {
  if (!data?.seo?.origin) return [];

  return buildDocumentSeoMeta({
    origin: data.seo.origin,
    pathname: location.pathname,
    pathPrefix: data.seo.pathPrefix,
    search: location.search,
  });
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;
  const i18n = storefront.i18n as I18nLocale;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    i18n,
    seo: {
      origin: getSiteOrigin(env, args.request),
      pathPrefix: i18n.pathPrefix ?? '',
    },
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: i18n.country,
      language: i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const lang = htmlLangFromLanguage(data?.i18n?.language);

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles} data-global-style="reset" />
        <link rel="stylesheet" href={appStyles} data-global-style="app" />
        <Meta />
        <Links />
      </head>
      <body>
        <PersistStylesheets />
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <Suspense fallback={null}>
        <Await resolve={data.cart}>
          {(cart) => (
            <CartBuyerIdentitySync
              countryCode={data.i18n.country}
              cartCountryCode={cart?.buyerIdentity?.countryCode}
              hasCart={Boolean(cart?.id)}
            />
          )}
        </Await>
      </Suspense>
      <PageLayout
        {...data}
        announcement={<WelcomeOffer />}
        newsletter={
          <NewsletterForm
            variant="footer"
            submitLabel="Join"
            note="No spam — drops and journal notes only."
            source="footer"
          />
        }
      >
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage: string | undefined;
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage =
      typeof error.data === 'string'
        ? error.data
        : error?.data?.message;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (errorStatus === 404) {
    return (
      <NotFoundState
        action={
          <Link to="/" prefetch="intent">
            Back home
          </Link>
        }
      />
    );
  }

  return (
    <ErrorState
      title="Something went wrong"
      message={
        errorMessage ||
        'We could not complete that request. Try again in a moment.'
      }
      action={
        <Link to="/" prefetch="intent">
          Back home
        </Link>
      }
    />
  );
}
