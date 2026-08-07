/**
 * Homepage Storefront queries.
 * Metaobject queries may fail on mock.shop — catch in loaders.
 */
import {PRODUCT_CARD_FRAGMENT} from '~/graphql/fragments/product';
import {COLLECTION_CARD_FRAGMENT} from '~/graphql/fragments/collection';

/** Ordered homepage sections from metaobjects (type: homepage_section). */
export const HOMEPAGE_SECTIONS_QUERY = `#graphql
  query HomepageSections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "homepage_section", first: 20) {
      nodes {
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
            ... on Collection {
              id
              handle
              title
            }
            ... on Product {
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
          references(first: 12) {
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
              }
              ... on Collection {
                id
                handle
                title
              }
            }
          }
        }
      }
    }
  }
` as const;

/** Featured / hero collection fallback when metaobjects are unavailable. */
export const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...CollectionCard
      }
    }
  }
  ${COLLECTION_CARD_FRAGMENT}
` as const;

/** Recommended products rail for homepage deferred load. */
export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
