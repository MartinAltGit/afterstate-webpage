/**
 * Collection GraphQL fragments for Storefront API.
 */

/** Compact collection fields for index grids and navigation. */
export const COLLECTION_CARD_FRAGMENT = `#graphql
  fragment CollectionCard on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;

/** Collection detail basics (products attached by the parent query). */
export const COLLECTION_DETAIL_FRAGMENT = `#graphql
  fragment CollectionDetail on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      id
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
` as const;
