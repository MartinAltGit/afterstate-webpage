import type {MappedProductOptions} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {ReactNode} from 'react';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {BuyControls} from '~/components/commerce/BuyControls';
import {isFinalSaleProduct} from '~/components/commerce/PurchaseNote';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import type {ProductMetafields} from '~/lib/metafields';
import {splitProductTitle, firstSentence} from '~/lib/product-title';
import styles from './ProductInfo.module.css';

export type ProductInfoVariant = {
  id: string;
  availableForSale: boolean;
  title?: string | null;
  sku?: string | null;
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  selectedOptions?: Array<{name: string; value: string}>;
} | null;

export type ProductInfoProps = {
  title: string;
  description?: string | null;
  tags?: string[] | null;
  productHandle: string;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductInfoVariant;
  metafields: ProductMetafields;
  onAddToCart?: () => void;
};

export type ProductDetailFields = {
  description?: ReactNode;
  fit?: ReactNode;
  fabric?: ReactNode;
  construction?: ReactNode;
  care?: ReactNode;
  measurements?: ReactNode;
  modelInfo?: ReactNode;
  sizeGuide?: ReactNode;
  shipping?: ReactNode;
};

function joinParts(parts: Array<string | null | undefined>, sep: string) {
  return parts.filter(Boolean).join(sep) || undefined;
}

export function getProductDetailFields(input: {
  title: string;
  description?: string | null;
  descriptionHtml?: string | null;
  metafields: ProductMetafields;
  sku?: string | null;
}): ProductDetailFields {
  const {description, descriptionHtml, metafields, sku} = input;
  const fabric = joinParts(
    [
      metafields.fabric,
      metafields.fabricComposition,
      metafields.fabricWeightGsm ? `${metafields.fabricWeightGsm} gsm` : null,
    ],
    ' · ',
  );
  const fit = joinParts([metafields.fit, metafields.fitNotes], ' — ');

  const descriptionNode = metafields.designStory ? (
    metafields.designStory
  ) : descriptionHtml ? (
    <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
  ) : (
    description
  );

  const shipping = (
    <>
      <p>
        Orders usually dispatch within 1–3 UK business days. UK delivery is
        typically 2–5 business days after dispatch; Europe 3–10. Tracking
        arrives by email once the carrier has it.
      </p>
      {metafields.shippingNote ? <p>{metafields.shippingNote}</p> : null}
      <p>
        Unworn items with tags may be returned within 14 days of delivery. You
        pay return shipping unless we sent the wrong or faulty item.{' '}
        <LocaleAwareLink prefetch="intent" to="/shipping-returns">
          Full shipping &amp; returns
        </LocaleAwareLink>
      </p>
      {sku ? <p>SKU {sku}</p> : null}
    </>
  );

  const care = metafields.careInstructions ? (
    metafields.careInstructions
  ) : (
    <>
      <p>Wash less. Cool water, gentle cycle, hang dry. Follow the care label.</p>
      <p>
        <LocaleAwareLink prefetch="intent" to="/care">
          Care notes
        </LocaleAwareLink>
      </p>
    </>
  );

  return {
    description: descriptionNode,
    fit,
    fabric,
    construction: metafields.construction ?? undefined,
    care,
    measurements: metafields.measurements ?? undefined,
    modelInfo: metafields.modelInformation ?? undefined,
    sizeGuide: metafields.sizeGuide ?? undefined,
    shipping,
  };
}

/**
 * Buy column: identity, options, CTA.
 */
export function ProductInfo({
  title,
  description,
  tags,
  productHandle,
  productOptions,
  selectedVariant,
  metafields,
  onAddToCart,
}: ProductInfoProps) {
  const {headline, support} = splitProductTitle(title);
  const lede =
    metafields.subtitle || support || firstSentence(description);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.kicker}>
          {metafields.collectionNumber ? (
            <p className={styles.eyebrow}>{metafields.collectionNumber}</p>
          ) : (
            <p className={styles.eyebrow}>Afterstate</p>
          )}
          {metafields.productBadge ? (
            <p className={styles.badge}>{metafields.productBadge}</p>
          ) : null}
        </div>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{headline}</h1>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
            className={styles.price}
          />
        </div>
        {lede ? <p className={styles.subtitle}>{lede}</p> : null}
      </header>

      <BuyControls
        productOptions={productOptions}
        selectedVariant={selectedVariant}
        onAddToCart={onAddToCart}
        productHandle={productHandle}
        productTitle={title}
        finalSale={isFinalSaleProduct({
          tags,
          productBadge: metafields.productBadge,
        })}
        shippingNote={null}
      />
    </div>
  );
}
