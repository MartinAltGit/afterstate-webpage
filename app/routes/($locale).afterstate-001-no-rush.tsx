import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).afterstate-001-no-rush';
import {CampaignHero} from '~/components/content/CampaignHero';
import {ManifestoBlock} from '~/components/content/ManifestoBlock';
import {ProductRow} from '~/components/content/ProductRow';
import {LookbookSequence} from '~/components/content/LookbookSequence';
import {ProductCard} from '~/components/commerce/ProductCard';
import {PageContainer} from '~/components/layout/PageContainer';
import {buildMetaTags} from '~/components/seo';
import {CAMPAIGN_BY_HANDLE_QUERY} from '~/graphql/queries/campaign';
import {PRODUCT_CARD_FRAGMENT} from '~/graphql/fragments/product';
import {SHOP_PATH} from '~/lib/content-paths';
import type {ProductCardFragment} from 'storefrontapi.generated';

const CAMPAIGN_HANDLE = 'afterstate-001-no-rush';
const COLLECTION_HANDLE = 'afterstate-001';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: '001: No Rush',
    description:
      'Afterstate 001 — No Rush. The first campaign: fewer pieces, clearer intent, and clothes made to last beyond the season.',
  });
};

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [campaignResult, productsResult] = await Promise.all([
    storefront
      .query(CAMPAIGN_BY_HANDLE_QUERY, {
        variables: {handle: CAMPAIGN_HANDLE},
        cache: storefront.CacheShort(),
      })
      .catch(() => null),
    storefront
      .query(CAMPAIGN_PRODUCTS_QUERY, {
        variables: {handle: COLLECTION_HANDLE, first: 8},
        cache: storefront.CacheShort(),
      })
      .catch(() => null),
  ]);

  const fromCollection = productsResult?.collection?.products?.nodes;
  const products =
    fromCollection && fromCollection.length > 0
      ? fromCollection
      : (productsResult?.products?.nodes ?? []);

  return {
    campaign: campaignResult?.metaobject ?? null,
    products,
  };
}

export default function Afterstate001NoRush() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div>
      <CampaignHero
        eyebrow="Afterstate 001"
        title="No Rush"
        subtitle="A slower pace for clothes made to last beyond the season."
        ctaLabel="Shop the collection"
        ctaTo={SHOP_PATH}
      />

      <PageContainer>
        <ManifestoBlock label="Manifesto">
          <p>
            Afterstate is for life beyond the rush — clothes designed without the
            pressure of trends or forced seasons.
          </p>
          <p>
            No Rush is the first statement: fewer pieces, clearer intent, and room
            to live in them.
          </p>
        </ManifestoBlock>

        <ProductRow
          eyebrow="Shop"
          title="Afterstate 001"
          ctaLabel="View all"
          ctaTo={SHOP_PATH}
        >
          {products.length
            ? products.map((product: ProductCardFragment) => (
                <ProductCard
                  key={product.id}
                  to={`/products/${product.handle}`}
                  title={product.title}
                  image={product.featuredImage}
                  price={product.priceRange?.minVariantPrice}
                />
              ))
            : null}
        </ProductRow>

        <LookbookSequence
          eyebrow="Lookbook"
          title="Afterstate 001 — No Rush"
        />

        <p style={{paddingBlock: '2rem', textAlign: 'center'}}>
          <Link to={SHOP_PATH} prefetch="intent">
            Continue to the shop
          </Link>
        </p>
      </PageContainer>
    </div>
  );
}

const CAMPAIGN_PRODUCTS_QUERY = `#graphql
  query CampaignProducts(
    $handle: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
