import {Suspense} from 'react';
import {Await, Link, useRouteLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import {
  getProductTypeLabel,
  pickShopRecommendations,
} from '~/lib/shop-catalog';
import {getShopCardImage, isShopCardStill} from '~/lib/shop-card-media';
import {useVariantUrl} from '~/lib/variants';
import styles from './CartEmpty.module.css';

export type CartEmptyProps = {
  onNavigate?: () => void;
  layout?: 'drawer' | 'page';
  className?: string;
};

type RootRecommendedProducts = {
  recommendedProducts?: Promise<{
    products?: {nodes?: CollectionGridProduct[] | null} | null;
  } | null>;
};

/**
 * Empty cart — quiet type, one action, a short start-here list.
 */
export function CartEmpty({
  onNavigate,
  layout = 'drawer',
  className,
}: CartEmptyProps) {
  const root = useRouteLoaderData('root') as RootRecommendedProducts | undefined;
  const productsPromise = root?.recommendedProducts;

  if (!productsPromise) {
    return (
      <CartEmptyLayout
        products={[]}
        onNavigate={onNavigate}
        layout={layout}
        className={className}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <CartEmptyLayout
          products={[]}
          pending
          onNavigate={onNavigate}
          layout={layout}
          className={className}
        />
      }
    >
      <Await resolve={productsPromise}>
        {(response) => (
          <CartEmptyLayout
            products={catalogProducts(response?.products?.nodes)}
            onNavigate={onNavigate}
            layout={layout}
            className={className}
          />
        )}
      </Await>
    </Suspense>
  );
}

function catalogProducts(
  nodes: CollectionGridProduct[] | null | undefined,
): CollectionGridProduct[] {
  return (nodes ?? []).filter(
    (product): product is CollectionGridProduct =>
      Boolean(product?.id && product.handle),
  );
}

function CartEmptyLayout({
  products,
  pending = false,
  onNavigate,
  layout,
  className,
}: {
  products: CollectionGridProduct[];
  pending?: boolean;
  onNavigate?: () => void;
  layout: 'drawer' | 'page';
  className?: string;
}) {
  const available = products.filter(
    (product) => product.availableForSale !== false,
  );
  const recs = pickShopRecommendations(
    available.length ? available : products,
    3,
  );

  return (
    <div
      className={[
        styles.root,
        layout === 'page' ? styles.page : styles.drawer,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.intro}>
        <p className={styles.index} aria-hidden="true">
          00
        </p>
        <p className={styles.title}>Your cart is empty</p>
        <p className={styles.copy}>Start with a piece that fits the pace.</p>
        <LocaleAwareLink
          to="/shop"
          onClick={onNavigate}
          prefetch="intent"
          className={styles.cta}
        >
          Shop the drop
        </LocaleAwareLink>
      </div>

      {pending ? (
        <section className={styles.recs} aria-hidden="true">
          <p className={styles.recsHeading}>Start here</p>
          <ul className={styles.list}>
            {Array.from({length: 3}, (_, index) => (
              <li key={index} className={styles.skeleton} />
            ))}
          </ul>
        </section>
      ) : recs.length ? (
        <section className={styles.recs} aria-labelledby="cart-empty-recs">
          <p id="cart-empty-recs" className={styles.recsHeading}>
            Start here
          </p>
          <ul className={styles.list}>
            {recs.map((product) => (
              <li key={product.id}>
                <RecommendedRow product={product} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function RecommendedRow({
  product,
  onNavigate,
}: {
  product: CollectionGridProduct;
  onNavigate?: () => void;
}) {
  const to = useVariantUrl(product.handle);
  const still = isShopCardStill(product.handle);
  const image = getShopCardImage(product);
  const formLabel = getProductTypeLabel(product);
  const soldOut = product.availableForSale === false;

  return (
    <Link
      to={to}
      prefetch="intent"
      onClick={onNavigate}
      className={[styles.row, soldOut ? styles.rowSold : null]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.thumb}>
        {image?.url ? (
          still ? (
            <img
              src={image.url}
              alt=""
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
              className={styles.thumbImage}
            />
          ) : (
            <Image
              data={image}
              alt=""
              loading="lazy"
              sizes="72px"
              className={styles.thumbImage}
            />
          )
        ) : (
          <span className={styles.thumbPlaceholder} aria-hidden="true" />
        )}
      </span>
      <span className={styles.rowBody}>
        <span className={styles.rowTitle}>{product.title}</span>
        <span className={styles.rowMeta}>
          {formLabel ? <span>{formLabel}</span> : null}
          {soldOut ? (
            <span>Sold out</span>
          ) : (
            <ProductPrice
              price={product.priceRange?.minVariantPrice}
              compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
              className={styles.rowPrice}
            />
          )}
        </span>
      </span>
      <span className={styles.rowArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
