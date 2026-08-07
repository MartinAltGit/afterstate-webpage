/**
 * Journal (blog) Storefront queries.
 * Uses Shopify Blog with handle "journal".
 */

export const JOURNAL_ARTICLE_CARD_FRAGMENT = `#graphql
  fragment JournalArticleCard on Article {
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

/** List articles from the journal blog. */
export const JOURNAL_INDEX_QUERY = `#graphql
  query JournalIndex(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    blog(handle: "journal") {
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
          ...JournalArticleCard
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
  ${JOURNAL_ARTICLE_CARD_FRAGMENT}
` as const;

/** Single journal article by handle. */
export const JOURNAL_ARTICLE_QUERY = `#graphql
  query JournalArticle(
    $articleHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    blog(handle: "journal") {
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
