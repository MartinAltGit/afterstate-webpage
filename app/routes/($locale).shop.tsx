import type {Route} from './+types/($locale).shop';
import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {CATALOG_QUERY} from '~/graphql/queries/collection';
import {ShopCatalog} from '~/components/collection/ShopCatalog';
import {ShopHero} from '~/components/collection/ShopHero';
import {EditorialStage} from '~/components/layout/EditorialStage';
import {Marquee} from '~/components/motion/Marquee';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {buildMetaTags} from '~/components/seo';
import {groupShopFamilies} from '~/lib/shop-catalog';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import type {ProductCardFragment} from 'storefrontapi.generated';
import shopStyles from '~/components/collection/ShopPage.module.css';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Limited editions',
    description:
      'Shop Afterstate limited editions. Short runs with no restocks — clothes cut to live in, not to chase a trend.',
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
    pageBy: 48,
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
  const items = products.nodes as ProductCardFragment[];
  const families = groupShopFamilies(items as CollectionGridProduct[]);
  const designCount = families.filter(
    (family) => family.products.length > 0,
  ).length;

  return (
    <div className={shopStyles.page}>
      <EditorialStage>
        <ShopHero designCount={designCount} />
        <Marquee className={shopStyles.ticker} />
        <div
          id="shop-catalog"
          className={[stageStyles.section, shopStyles.catalog].join(' ')}
        >
          <ShopCatalog products={items} />
        </div>
      </EditorialStage>
    </div>
  );
}
