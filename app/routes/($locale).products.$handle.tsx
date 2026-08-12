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
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {ProductGallery} from '~/components/commerce/ProductGallery';
import type {ProductMediaItem} from '~/components/commerce/ProductMedia';
import {BuyControls} from '~/components/commerce/BuyControls';
import {ProductDetails} from '~/components/product/ProductDetails';
import {ProductStory} from '~/components/product/ProductStory';
import {CompleteTheLook} from '~/components/product/CompleteTheLook';
import {RelatedProducts} from '~/components/product/RelatedProducts';
import {MobileStickyBuyBar} from '~/components/product/MobileStickyBuyBar';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {PageContainer} from '~/components/layout/PageContainer';
import {Reveal} from '~/components/motion/Reveal';
import {ProductJsonLd, buildMetaTags} from '~/components/seo';
import {useAside} from '~/components/Aside';
import {useAbsoluteSeoUrl} from '~/lib/seo/useAbsoluteSeoUrl';
import type {
  ProductCardFragment,
  ProductRecommendationsQuery,
} from 'storefrontapi.generated';
import type {RecommendedProduct} from '~/components/commerce/ProductRecommendations';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

export const meta: Route.MetaFunction = ({data}) => {
  return buildMetaTags({
    title:
      data?.seoTitle ||
      data?.product?.title ||
      'Product',
    description:
      data?.seoDescription ||
      data?.product?.description ||
      undefined,
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
  const galleryMedia = buildGalleryMedia(product, selectedVariant, metafields);

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

  const fabricParts = [
    metafields.fabric,
    metafields.fabricComposition,
    metafields.fabricWeightGsm
      ? `${metafields.fabricWeightGsm} gsm`
      : null,
  ].filter(Boolean);

  const fitParts = [metafields.fit, metafields.fitNotes].filter(Boolean);

  return (
    <div className="product-page">
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

      <PageContainer>
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

      <PageContainer className="product-page-main">
        <Reveal>
          <ProductGallery media={galleryMedia} />
        </Reveal>

        <Reveal delayMs={90} className="product-page-info">
          {metafields.collectionNumber ? (
            <p className="product-page-eyebrow">{metafields.collectionNumber}</p>
          ) : null}
          <h1>{product.title}</h1>
          {metafields.subtitle ? (
            <p className="product-page-subtitle">{metafields.subtitle}</p>
          ) : null}
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <BuyControls
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            onAddToCart={onAddToCart}
            productHandle={product.handle}
            productTitle={product.title}
          />
        </Reveal>
      </PageContainer>

      <PageContainer>
        <Reveal delayMs={40}>
          <ProductDetails
            fit={fitParts.length ? fitParts.join(' — ') : undefined}
            fabric={fabricParts.length ? fabricParts.join(' · ') : undefined}
            construction={metafields.construction ?? undefined}
            care={metafields.careInstructions ?? undefined}
            measurements={metafields.measurements ?? undefined}
            modelInfo={metafields.modelInformation ?? undefined}
          />
        </Reveal>

        {(metafields.designStory || product.descriptionHtml) && (
          <Reveal delayMs={70}>
            <ProductStory>
              {metafields.designStory ? (
                <p>{metafields.designStory}</p>
              ) : (
                <div
                  dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                />
              )}
            </ProductStory>
          </Reveal>
        )}

        <Reveal delayMs={90}>
          <CompleteTheLook products={lookProducts} />
        </Reveal>

        <Reveal delayMs={110}>
          {relatedFromMeta.length > 0 ? (
            <RelatedProducts products={relatedFromMeta} />
          ) : (
            <Suspense fallback={null}>
              <Await resolve={recommendations}>
                {(response: ProductRecommendationsQuery | null) => {
                  const recs: RecommendedProduct[] =
                    response?.productRecommendations
                      ?.filter(
                        (p): p is ProductCardFragment => Boolean(p),
                      )
                      .map((p) => ({
                        id: p.id,
                        handle: p.handle,
                        title: p.title,
                        featuredImage: p.featuredImage,
                        priceRange: p.priceRange,
                        subtitle: getProductMetafields(p).subtitle,
                      })) ?? [];
                  return <RelatedProducts products={recs} />;
                }}
              </Await>
            </Suspense>
          )}
        </Reveal>
      </PageContainer>

      <MobileStickyBuyBar
        title={product.title}
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
        availableForSale={Boolean(selectedVariant?.availableForSale)}
        lines={lines}
        onAddToCart={onAddToCart}
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

function buildGalleryMedia(
  product: {
    title: string;
    featuredImage?: {
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  },
  selectedVariant: {
    image?: {
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  } | null,
  metafields: ReturnType<typeof getProductMetafields>,
): ProductMediaItem[] {
  const items: ProductMediaItem[] = [];
  const seen = new Set<string>();

  const pushImage = (
    image:
      | {
          id?: string | null;
          url: string;
          altText?: string | null;
          width?: number | null;
          height?: number | null;
        }
      | null
      | undefined,
  ) => {
    if (!image?.url || seen.has(image.url)) return;
    seen.add(image.url);
    items.push({
      mediaContentType: 'IMAGE',
      id: image.id || image.url,
      alt: image.altText || product.title,
      image: {
        id: image.id ?? undefined,
        url: image.url,
        altText: image.altText,
        width: image.width,
        height: image.height,
      },
    });
  };

  pushImage(selectedVariant?.image);
  pushImage(product.featuredImage);

  for (const img of metafields.editorialMedia ?? []) {
    pushImage({
      id: img.url,
      url: img.url,
      altText: img.altText,
      width: img.width,
      height: img.height,
    });
  }

  return items;
}
