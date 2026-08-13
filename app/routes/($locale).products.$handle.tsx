import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {Suspense} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {
  PRODUCT_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
} from '~/graphql/queries/product';
import {getProductMetafields} from '~/lib/metafields';
import {buildGalleryMedia} from '~/lib/product-media';
import {ProductGallery} from '~/components/commerce/ProductGallery';
import {ProductInfo, getProductDetailFields} from '~/components/product/ProductInfo';
import {ProductDetails} from '~/components/product/ProductDetails';
import {CompleteTheLook} from '~/components/product/CompleteTheLook';
import {RelatedProducts} from '~/components/product/RelatedProducts';
import {MobileStickyBuyBar} from '~/components/product/MobileStickyBuyBar';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {PageContainer} from '~/components/layout/PageContainer';
import {Reveal} from '~/components/motion/Reveal';
import {ProductJsonLd, buildMetaTags} from '~/components/seo';
import campaignLook from '~/assets/mockups/campaign-look-new.jpg';
import {CampaignLook} from '~/sections/CampaignLook';
import {useAside} from '~/components/Aside';
import {useAbsoluteSeoUrl} from '~/lib/seo/useAbsoluteSeoUrl';
import type {
  ProductCardFragment,
  ProductRecommendationsQuery,
} from 'storefrontapi.generated';
import type {RecommendedProduct} from '~/components/commerce/ProductRecommendations';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import styles from '~/components/product/ProductPage.module.css';

export const meta: Route.MetaFunction = ({data}) => {
  return buildMetaTags({
    title: data?.seoTitle || data?.product?.title || 'Product',
    description:
      data?.seoDescription || data?.product?.description || undefined,
    type: 'product',
    imageUrl:
      data?.product?.selectedOrFirstAvailableVariant?.image?.url ||
      data?.product?.featuredImage?.url ||
      undefined,
    imageAlt: data?.product?.title,
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args, criticalData.product.id);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  const metafields = getProductMetafields(product);

  return {
    product,
    seoTitle: metafields.seoTitleOverride ?? null,
    seoDescription: metafields.seoDescriptionOverride ?? null,
  };
}

function loadDeferredData(
  {context}: Route.LoaderArgs,
  productId: string,
) {
  const recommendations = context.storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {productId},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendations,
  };
}

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();
  const {open} = useAside();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const metafields = getProductMetafields(product);
  const galleryMedia = buildGalleryMedia(product, selectedVariant, metafields.editorialMedia);

  const lines: OptimisticCartLineInput[] = selectedVariant?.id
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
        },
      ]
    : [];

  const onAddToCart = () => open('cart');
  const productUrl = useAbsoluteSeoUrl(`/products/${product.handle}`);
  const lookProducts = mapMetafieldProducts(metafields.completeTheLook);
  const relatedFromMeta = mapMetafieldProducts(metafields.relatedProducts);
  const selection = selectedVariant?.selectedOptions
    ?.map((option: {name: string; value: string}) => option.value)
    .filter(Boolean)
    .join(' · ');
  const detailFields = getProductDetailFields({
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    metafields,
    sku: selectedVariant?.sku,
  });

  return (
    <div className={`product-page ${styles.page}`}>
      <ProductJsonLd
        name={product.title}
        description={
          metafields.seoDescriptionOverride || product.description || undefined
        }
        url={productUrl}
        image={
          selectedVariant?.image?.url ||
          product.featuredImage?.url ||
          undefined
        }
        sku={selectedVariant?.sku || undefined}
        brand={product.vendor || 'Afterstate'}
        price={selectedVariant?.price?.amount}
        priceCurrency={selectedVariant?.price?.currencyCode}
        availability={
          selectedVariant?.availableForSale ? 'InStock' : 'OutOfStock'
        }
      />

      <PageContainer className={styles.crumbs}>
        <Reveal>
          <Breadcrumbs
            items={[
              {label: 'Home', to: '/'},
              {label: 'Shop', to: '/shop'},
              {label: product.title},
            ]}
          />
        </Reveal>
      </PageContainer>

      <div className={styles.main}>
        <Reveal className={styles.gallery}>
          <ProductGallery media={galleryMedia} />
        </Reveal>
        <div className={styles.info}>
          <ProductInfo
            title={product.title}
            description={product.description}
            tags={product.tags}
            productHandle={product.handle}
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            metafields={metafields}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>

      <div className={styles.details}>
        <ProductDetails {...detailFields} />
      </div>

      <PageContainer className={styles.more}>
        <Reveal delayMs={40}>
          <CompleteTheLook products={lookProducts} heading="Worn with" />
        </Reveal>
        <Reveal delayMs={80}>
          {relatedFromMeta.length > 0 ? (
            <RelatedProducts products={relatedFromMeta} heading="Also in the drop" />
          ) : (
            <Suspense fallback={null}>
              <Await resolve={recommendations}>
                {(response: ProductRecommendationsQuery | null) => {
                  const recs: RecommendedProduct[] =
                    response?.productRecommendations
                      ?.filter((p): p is ProductCardFragment => Boolean(p))
                      .map((p) => ({
                        id: p.id,
                        handle: p.handle,
                        title: p.title,
                        featuredImage: p.featuredImage,
                        priceRange: p.priceRange,
                        subtitle: getProductMetafields(p).subtitle,
                      })) ?? [];
                  return <RelatedProducts products={recs} heading="Also in the drop" />;
                }}
              </Await>
            </Suspense>
          )}
        </Reveal>
      </PageContainer>

      <CampaignLook imageSrc={campaignLook} />

      <MobileStickyBuyBar
        title={product.title}
        detail={selection}
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
        availableForSale={Boolean(selectedVariant?.availableForSale)}
        lines={lines}
        onAddToCart={onAddToCart}
        productHandle={product.handle}
        productTitle={product.title}
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function mapMetafieldProducts(
  products: ReturnType<typeof getProductMetafields>['relatedProducts'],
): RecommendedProduct[] {
  return (products ?? []).map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    featuredImage: p.featuredImage
      ? {
          id: undefined,
          url: p.featuredImage.url,
          altText: p.featuredImage.altText,
          width: p.featuredImage.width,
          height: p.featuredImage.height,
        }
      : null,
    priceRange: p.priceRange
      ? {
          minVariantPrice: {
            amount: p.priceRange.minVariantPrice.amount,
            currencyCode: p.priceRange.minVariantPrice
              .currencyCode as CurrencyCode,
          },
        }
      : undefined,
  }));
}
