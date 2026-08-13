import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {getPaginationVariables, Analytics, Pagination} from '@shopify/hydrogen';
import {COLLECTION_HANDLE_REDIRECTS} from '~/lib/content-paths';
import type {I18nLocale} from '~/lib/i18n';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {COLLECTION_QUERY} from '~/graphql/queries/collection';
import {CollectionHero} from '~/components/collection/CollectionHero';
import {CollectionToolbar} from '~/components/collection/CollectionToolbar';
import {CollectionProductGrid} from '~/components/collection/CollectionProductGrid';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {EmptyState} from '~/components/feedback/EmptyState';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {Reveal} from '~/components/motion/Reveal';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {getProductSubtitle} from '~/lib/metafields';
import {buildMetaTags} from '~/components/seo';
import type {ProductCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  const name = data?.collection?.title;
  return buildMetaTags({
    title: name ?? 'Collection',
    description:
      data?.collection.description?.trim() ||
      (name
        ? `${name} from Afterstate — a limited chapter of clothes made to last.`
        : undefined),
  });
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

  const alias = COLLECTION_HANDLE_REDIRECTS[handle.toLowerCase()];
  if (alias && alias !== `/collections/${handle}`) {
    const pathPrefix = (storefront.i18n as I18nLocale).pathPrefix || '';
    throw redirect(`${pathPrefix}${alias}`, 301);
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
  const manifesto =
    collection.description?.trim() ||
    'Clothes for life beyond the rush — fewer pieces, clearer intent.';

  return (
    <div className="collection-page">
      <CollectionHero
        title={collection.title}
        description={collection.description}
        image={collection.image}
      />

      <EditorialStage>
        <div className={stageStyles.section}>
          <Reveal as="header" className={stageStyles.header}>
            <p className={stageStyles.eyebrow}>Manifesto</p>
            <h2 className={stageStyles.title}>{collection.title}</h2>
            <p className={stageStyles.lede}>{manifesto}</p>
          </Reveal>

          <Reveal delayMs={70}>
            <CollectionToolbar productCount={productCount} />
          </Reveal>

          <Reveal delayMs={120}>
            <Pagination connection={collection.products}>
              {({nodes, isLoading, PreviousLink, NextLink}) => (
                <div>
                  <div className={stageStyles.pager}>
                    <PreviousLink>
                      {isLoading ? (
                        'Loading...'
                      ) : (
                        <span>
                          <span aria-hidden="true">↑</span> Load previous
                        </span>
                      )}
                    </PreviousLink>
                  </div>

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
                      products={(nodes as ProductCardFragment[]).map(
                        (product) => ({
                          id: product.id,
                          handle: product.handle,
                          title: product.title,
                          subtitle: getProductSubtitle(product),
                          featuredImage: product.featuredImage,
                          priceRange: product.priceRange,
                        }),
                      )}
                    />
                  )}

                  <div className={stageStyles.pager}>
                    <span />
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
                </div>
              )}
            </Pagination>
          </Reveal>
        </div>
      </EditorialStage>

      <OpeningStatement
        section={{
          id: 'collection-closing',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: 'Life beyond the rush.',
          body: 'Every piece is limited edition. Short runs. No restocks.',
        }}
      />

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
