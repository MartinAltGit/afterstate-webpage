import type {Route} from './+types/($locale).shop';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {CATALOG_QUERY} from '~/graphql/queries/collection';
import {CollectionProductGrid} from '~/components/collection/CollectionProductGrid';
import {CollectionToolbar} from '~/components/collection/CollectionToolbar';
import {PageContainer} from '~/components/layout/PageContainer';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {getProductSubtitle} from '~/lib/metafields';
import type {ProductCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Afterstate | Shop'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);

  return {products};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Shop() {
  const {products} = useLoaderData<typeof loader>();
  const count = products.nodes.length;

  return (
    <PageContainer as="div" className="shop-page">
      <Breadcrumbs items={[{label: 'Home', to: '/'}, {label: 'Shop'}]} />
      <header className="shop-header">
        <h1>Shop</h1>
      </header>
      <CollectionToolbar productCount={count} />
      <Pagination connection={products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div className="shop-catalog">
            <PreviousLink>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  <span aria-hidden="true">↑</span> Load previous
                </span>
              )}
            </PreviousLink>
            <CollectionProductGrid
              products={(nodes as ProductCardFragment[]).map((product) => ({
                id: product.id,
                handle: product.handle,
                title: product.title,
                subtitle: getProductSubtitle(product),
                featuredImage: product.featuredImage,
                priceRange: product.priceRange,
              }))}
              emptyMessage="No products available yet."
            />
            <NextLink>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  Load more <span aria-hidden="true">↓</span>
                </span>
              )}
            </NextLink>
          </div>
        )}
      </Pagination>
    </PageContainer>
  );
}
