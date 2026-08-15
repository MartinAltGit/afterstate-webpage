/**
 * Fashion Blog Storefront queries.
 * Uses Shopify Blog with handle "blog" — trends, stories, fashion-world coverage.
 * Distinct from Journal (`journal` handle → `/journal`).
 */

import {PRODUCT_CARD_FRAGMENT} from '~/graphql/fragments/product';

export const BLOG_ARTICLE_CARD_FRAGMENT = `#graphql
  fragment BlogArticleCard on Article {
    id
    handle
    title
    excerpt
    publishedAt
    image {
      id
      altText
      url
      width
      height
    }
    author: authorV2 {
      name
    }
  }
` as const;

/** List articles from the fashion blog — newest first, stacked on the index. */
export const BLOG_INDEX_QUERY = `#graphql
  query BlogIndex(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    blog(handle: "blog") {
      id
      handle
      title
      seo {
        title
        description
      }
      articles(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: PUBLISHED_AT
        reverse: true
      ) {
        nodes {
          ...BlogArticleCard
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${BLOG_ARTICLE_CARD_FRAGMENT}
` as const;

/** Single fashion-blog article by handle. */
export const BLOG_ARTICLE_QUERY = `#graphql
  query BlogArticle(
    $articleHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    blog(handle: "blog") {
      handle
      title
      articleByHandle(handle: $articleHandle) {
        id
        handle
        title
        contentHtml
        excerpt
        publishedAt
        tags
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;

/** Three live pieces for the article look-ad rail. */
export const LOOK_AD_PRODUCTS_QUERY = `#graphql
  query LookAdProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
