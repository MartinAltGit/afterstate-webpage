import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {Suspense} from 'react';
import {HomepageSections} from '~/sections';
import {ProductItem} from '~/components/ProductItem';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/queries/homepage';
import {PageContainer} from '~/components/layout/PageContainer';
import type {ProductCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Afterstate | Life beyond the rush.'}];
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

  return (
    <PageContainer as="div">
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
    </PageContainer>
  );
}
