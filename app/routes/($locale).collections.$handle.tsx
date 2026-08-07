import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {getPaginationVariables, Analytics, Pagination} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {COLLECTION_QUERY} from '~/graphql/queries/collection';
import {CollectionHero} from '~/components/collection/CollectionHero';
import {CollectionManifesto} from '~/components/collection/CollectionManifesto';
import {CollectionToolbar} from '~/components/collection/CollectionToolbar';
import {CollectionProductGrid} from '~/components/collection/CollectionProductGrid';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {PageContainer} from '~/components/layout/PageContainer';
import {EmptyState} from '~/components/feedback/EmptyState';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {getProductSubtitle} from '~/lib/metafields';
import type {ProductCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {
      title: `Afterstate | ${data?.collection.title ?? 'Collection'}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const productCount = collection.products.nodes.length;

  return (
    <div className="collection-page">
      <PageContainer>
        <Breadcrumbs
          items={[
            {label: 'Home', to: '/'},
            {label: 'Collections', to: '/collections'},
            {label: collection.title},
          ]}
        />
      </PageContainer>

      <CollectionHero
        title={collection.title}
        description={collection.description}
        image={collection.image}
      />

      <PageContainer>
        <CollectionManifesto title="Manifesto">
          <p>
            {collection.description?.trim()
              ? collection.description
              : 'Clothes for life beyond the rush — fewer pieces, clearer intent.'}
          </p>
        </CollectionManifesto>

        <CollectionToolbar productCount={productCount} />

        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <div>
              <PreviousLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <span>
                    <span aria-hidden="true">↑</span> Load previous
                  </span>
                )}
              </PreviousLink>

              {nodes.length === 0 ? (
                <EmptyState
                  title="Nothing in this collection"
                  message="Check back when Afterstate adds pieces here."
                  action={
                    <LocaleAwareLink to="/shop" prefetch="intent">
                      Shop all
                    </LocaleAwareLink>
                  }
                />
              ) : (
                <CollectionProductGrid
                  products={(nodes as ProductCardFragment[]).map((product) => ({
                    id: product.id,
                    handle: product.handle,
                    title: product.title,
                    subtitle: getProductSubtitle(product),
                    featuredImage: product.featuredImage,
                    priceRange: product.priceRange,
                  }))}
                />
              )}

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

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}
