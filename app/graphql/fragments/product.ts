/**
 * Product GraphQL fragments for Storefront API.
 * Prefer PRODUCT_CARD_FRAGMENT for grids; PRODUCT_METAFIELDS_FRAGMENT on PDP only.
 */

/** Compact product fields for cards, grids, and related-product rails. */
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    subtitle: metafield(namespace: "custom", key: "subtitle") {
      value
      type
    }
  }
` as const;

/**
 * All Afterstate `custom.*` product metafields.
 * Include only on product detail (and similar storytelling surfaces).
 */
export const PRODUCT_METAFIELDS_FRAGMENT = `#graphql
  fragment ProductMetafields on Product {
    subtitle: metafield(namespace: "custom", key: "subtitle") {
      value
      type
    }
    collectionNumber: metafield(namespace: "custom", key: "collection_number") {
      value
      type
    }
    fit: metafield(namespace: "custom", key: "fit") {
      value
      type
    }
    fitNotes: metafield(namespace: "custom", key: "fit_notes") {
      value
      type
    }
    fabric: metafield(namespace: "custom", key: "fabric") {
      value
      type
    }
    fabricComposition: metafield(namespace: "custom", key: "fabric_composition") {
      value
      type
    }
    fabricWeightGsm: metafield(namespace: "custom", key: "fabric_weight_gsm") {
      value
      type
    }
    construction: metafield(namespace: "custom", key: "construction") {
      value
      type
    }
    measurements: metafield(namespace: "custom", key: "measurements") {
      value
      type
    }
    modelInformation: metafield(namespace: "custom", key: "model_information") {
      value
      type
    }
    designStory: metafield(namespace: "custom", key: "design_story") {
      value
      type
    }
    careInstructions: metafield(namespace: "custom", key: "care_instructions") {
      value
      type
    }
    sizeGuide: metafield(namespace: "custom", key: "size_guide") {
      value
      type
    }
    shippingNote: metafield(namespace: "custom", key: "shipping_note") {
      value
      type
    }
    productBadge: metafield(namespace: "custom", key: "product_badge") {
      value
      type
    }
    editorialMedia: metafield(namespace: "custom", key: "editorial_media") {
      value
      type
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
      references(first: 20) {
        nodes {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
    relatedProducts: metafield(namespace: "custom", key: "related_products") {
      value
      type
      references(first: 12) {
        nodes {
          ... on Product {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    completeTheLook: metafield(namespace: "custom", key: "complete_the_look") {
      value
      type
      references(first: 12) {
        nodes {
          ... on Product {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    seoTitleOverride: metafield(namespace: "custom", key: "seo_title_override") {
      value
      type
    }
    seoDescriptionOverride: metafield(namespace: "custom", key: "seo_description_override") {
      value
      type
    }
  }
` as const;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

/** Full PDP product fragment (variants + metafields + SEO). */
export const PRODUCT_DETAIL_FRAGMENT = `#graphql
  fragment ProductDetail on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    ...ProductMetafields
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${PRODUCT_METAFIELDS_FRAGMENT}
` as const;
