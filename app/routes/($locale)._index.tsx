import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {Suspense} from 'react';
import {HomepageSections} from '~/sections';
import {ProductItem} from '~/components/ProductItem';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/queries/homepage';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {OrganizationJsonLd, buildMetaTags} from '~/components/seo';
import {useAbsoluteSeoUrl} from '~/lib/seo/useAbsoluteSeoUrl';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Life beyond the rush.',
    description:
      'Afterstate — life beyond the rush. Clothes made for a slower, clearer pace.',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData(_args: Route.LoaderArgs) {
  return {};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const siteUrl = useAbsoluteSeoUrl('/');

  return (
    <>
      <OrganizationJsonLd url={siteUrl} />
      <Suspense fallback={<HomepageSections />}>
        <Await resolve={data.recommendedProducts}>
          {(response) => (
            <HomepageSections
              products={
                response
                  ? response.products.nodes.map(
                      (product: ProductCardFragment) => (
                        <ProductItem key={product.id} product={product} />
                      ),
                    )
                  : null
              }
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}
