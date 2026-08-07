import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections._index';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';
import {COLLECTIONS_QUERY} from '~/graphql/queries/collection';
import {PageContainer} from '~/components/layout/PageContainer';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {EmptyState} from '~/components/feedback/EmptyState';
import type {CollectionCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Afterstate | Collections'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <PageContainer as="div" className="collections-index">
      <Breadcrumbs
        items={[{label: 'Home', to: '/'}, {label: 'Collections'}]}
      />
      <header className="collections-index-header">
        <h1>Collections</h1>
        <p>Chapters of Afterstate — clothes for a slower pace.</p>
      </header>

      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : (
                <span>
                  <span aria-hidden="true">↑</span> Load previous
                </span>
              )}
            </PreviousLink>

            {nodes.length === 0 ? (
              <EmptyState
                title="No collections yet"
                message="Afterstate collections will appear here."
                action={
                  <LocaleAwareLink to="/shop" prefetch="intent">
                    Shop all
                  </LocaleAwareLink>
                }
              />
            ) : (
              <ul className="collections-editorial-grid">
                {(nodes as CollectionCardFragment[]).map(
                  (collection, index) => (
                    <li key={collection.id}>
                      <LocaleAwareLink
                        className="collection-editorial-card"
                        to={`/collections/${collection.handle}`}
                        prefetch="intent"
                      >
                        <div className="collection-editorial-media">
                          {collection.image ? (
                            <Image
                              alt={
                                collection.image.altText || collection.title
                              }
                              data={collection.image}
                              loading={index < 2 ? 'eager' : 'lazy'}
                              sizes="(min-width: 45em) 50vw, 100vw"
                            />
                          ) : (
                            <div className="collection-editorial-placeholder" />
                          )}
                        </div>
                        <div className="collection-editorial-copy">
                          <h2>{collection.title}</h2>
                          {collection.description ? (
                            <p>{collection.description}</p>
                          ) : null}
                        </div>
                      </LocaleAwareLink>
                    </li>
                  ),
                )}
              </ul>
            )}

            <NextLink>
              {isLoading ? 'Loading...' : (
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
