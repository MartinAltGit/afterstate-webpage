/**
 * Typed helpers for reading Afterstate product metafields from Storefront API payloads.
 * Fragments alias metafields as camelCase fields (e.g. `collectionNumber`).
 */

export type MetafieldImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MetafieldProductRef = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: MetafieldImage | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  } | null;
};

type RawMetafield = {
  value?: string | null;
  type?: string | null;
  reference?: {
    image?: MetafieldImage | null;
  } | null;
  references?: {
    nodes?: Array<
      | {image?: MetafieldImage | null}
      | MetafieldProductRef
      | null
    > | null;
  } | null;
} | null;

export type ProductMetafields = {
  subtitle?: string | null;
  collectionNumber?: string | null;
  fit?: string | null;
  fitNotes?: string | null;
  fabric?: string | null;
  fabricComposition?: string | null;
  fabricWeightGsm?: string | null;
  construction?: string | null;
  measurements?: string | null;
  modelInformation?: string | null;
  designStory?: string | null;
  careInstructions?: string | null;
  sizeGuide?: string | null;
  shippingNote?: string | null;
  productBadge?: string | null;
  editorialMedia?: MetafieldImage[];
  relatedProducts?: MetafieldProductRef[];
  completeTheLook?: MetafieldProductRef[];
  seoTitleOverride?: string | null;
  seoDescriptionOverride?: string | null;
};

function readValue(field: RawMetafield): string | null {
  if (!field?.value) return null;
  return field.value;
}

function readMediaImages(field: RawMetafield): MetafieldImage[] {
  if (!field) return [];

  const fromList =
    field.references?.nodes
      ?.map((node) => {
        if (node && 'image' in node && node.image?.url) {
          return node.image;
        }
        return null;
      })
      .filter((img): img is MetafieldImage => Boolean(img)) ?? [];

  if (fromList.length) return fromList;

  if (field.reference?.image?.url) {
    return [field.reference.image];
  }

  return [];
}

function readProductRefs(field: RawMetafield): MetafieldProductRef[] {
  if (!field?.references?.nodes) return [];

  return field.references.nodes.filter(
    (node): node is MetafieldProductRef =>
      Boolean(node && 'id' in node && 'handle' in node && node.id && node.handle),
  );
}

/**
 * Extract typed Afterstate metafields from a product object returned by
 * PRODUCT_METAFIELDS_FRAGMENT / PRODUCT_DETAIL_FRAGMENT / PRODUCT_CARD_FRAGMENT.
 */
export function getProductMetafields(product: any): ProductMetafields {
  if (!product || typeof product !== 'object') {
    return {};
  }

  return {
    subtitle: readValue(product.subtitle),
    collectionNumber: readValue(product.collectionNumber),
    fit: readValue(product.fit),
    fitNotes: readValue(product.fitNotes),
    fabric: readValue(product.fabric),
    fabricComposition: readValue(product.fabricComposition),
    fabricWeightGsm: readValue(product.fabricWeightGsm),
    construction: readValue(product.construction),
    measurements: readValue(product.measurements),
    modelInformation: readValue(product.modelInformation),
    designStory: readValue(product.designStory),
    careInstructions: readValue(product.careInstructions),
    sizeGuide: readValue(product.sizeGuide),
    shippingNote: readValue(product.shippingNote),
    productBadge: readValue(product.productBadge),
    editorialMedia: readMediaImages(product.editorialMedia),
    relatedProducts: readProductRefs(product.relatedProducts),
    completeTheLook: readProductRefs(product.completeTheLook),
    seoTitleOverride: readValue(product.seoTitleOverride),
    seoDescriptionOverride: readValue(product.seoDescriptionOverride),
  };
}

/** Convenience: subtitle only (e.g. product cards). */
export function getProductSubtitle(product: any): string | null {
  return getProductMetafields(product).subtitle ?? null;
}
