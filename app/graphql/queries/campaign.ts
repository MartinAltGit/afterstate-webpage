/**
 * Campaign / lookbook metaobject queries.
 * Mock.shop may not expose metaobjects — catch gracefully in loaders.
 */

const METAOBJECT_FIELDS_SELECTION = `#graphql
  fragment MetaobjectFields on Metaobject {
    id
    handle
    type
    updatedAt
    fields {
      key
      type
      value
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
        ... on Video {
          id
          sources {
            url
            mimeType
          }
          previewImage {
            url
            altText
            width
            height
          }
        }
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
        }
        ... on Collection {
          id
          handle
          title
          image {
            url
            altText
            width
            height
          }
        }
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            type
            value
          }
        }
      }
      references(first: 24) {
        nodes {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
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
          ... on Collection {
            id
            handle
            title
          }
          ... on Metaobject {
            id
            handle
            type
            fields {
              key
              type
              value
            }
          }
        }
      }
    }
  }
` as const;

/** List campaign metaobjects. */
export const CAMPAIGNS_QUERY = `#graphql
  query Campaigns(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "campaign", first: 20) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_SELECTION}
` as const;

/** Single campaign by handle. */
export const CAMPAIGN_BY_HANDLE_QUERY = `#graphql
  query CampaignByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {type: "campaign", handle: $handle}) {
      ...MetaobjectFields
    }
  }
  ${METAOBJECT_FIELDS_SELECTION}
` as const;

/** Lookbook metaobjects. */
export const LOOKBOOKS_QUERY = `#graphql
  query Lookbooks(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "lookbook", first: 20) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_SELECTION}
` as const;

/** Single lookbook by handle. */
export const LOOKBOOK_BY_HANDLE_QUERY = `#graphql
  query LookbookByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {type: "lookbook", handle: $handle}) {
      ...MetaobjectFields
    }
  }
  ${METAOBJECT_FIELDS_SELECTION}
` as const;

/** Collection chapter metaobjects (editorial chapters bound to collections). */
export const COLLECTION_CHAPTERS_QUERY = `#graphql
  query CollectionChapters(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "collection_chapter", first: 20) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_SELECTION}
` as const;
