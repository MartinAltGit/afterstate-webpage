import type {Route} from './+types/($locale).shop';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import heroShop from '~/assets/mockups/hero-campaign-hoodies.jpg';
import {CATALOG_QUERY} from '~/graphql/queries/collection';
import {CollectionProductGrid} from '~/components/collection/CollectionProductGrid';
import {CollectionToolbar} from '~/components/collection/CollectionToolbar';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {buildMetaTags} from '~/components/seo';
import {getProductSubtitle} from '~/lib/metafields';
import type {ProductCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Shop',
    description:
      'Shop Afterstate limited editions — short runs, no restocks, clothes made to stay.',
  });
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
    <div className="shop-page">
      <PageHero
        eyebrow="Afterstate"
        title="Shop"
        support="Limited editions only — short runs, clear intent, clothes made to stay."
        imageSrc={heroShop}
        imageAlt="Afterstate hoodies — charcoal and burgundy limited drop"
      />

      <EditorialStage>
        <div className={stageStyles.section}>
          <Reveal as="header" className={stageStyles.header}>
            <p className={stageStyles.eyebrow}>Catalog</p>
            <h2 className={stageStyles.title}>All pieces</h2>
            <p className={stageStyles.lede}>
              Every item in the Afterstate catalog — fewer SKUs, clearer
              purpose.
            </p>
          </Reveal>

          <Reveal delayMs={70}>
            <CollectionToolbar productCount={count} />
          </Reveal>

          <Reveal delayMs={120}>
            <Pagination connection={products}>
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
          id: 'shop-closing',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: 'Life beyond the rush.',
          body: 'Every piece is limited edition. Short runs. No restocks.',
        }}
      />
    </div>
  );
}
