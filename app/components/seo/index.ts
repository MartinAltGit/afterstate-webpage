export {
  buildPageTitle,
  buildMetaTags,
  clampSeoText,
  type SeoMetaInput,
  type MetaDescriptor,
} from './SeoMeta';

export {
  CanonicalUrl,
  AlternateLanguageLinks,
  buildCanonicalLinkDescriptor,
  buildAlternateLanguageLinkDescriptors,
  type CanonicalUrlProps,
  type AlternateLanguageLinksProps,
} from './CanonicalUrl';

export {
  OrganizationJsonLd,
  ProductJsonLd,
  ProductGroupJsonLd,
  BreadcrumbJsonLd,
  ArticleJsonLd,
  FaqJsonLd,
  type OrganizationJsonLdProps,
  type ProductJsonLdProps,
  type ProductGroupJsonLdProps,
  type BreadcrumbJsonLdProps,
  type BreadcrumbJsonLdItem,
  type ArticleJsonLdProps,
  type FaqJsonLdProps,
  type FaqJsonLdItem,
} from './JsonLd';

export {
  buildCanonicalUrl,
  stripTrackingParams,
  shouldNoIndex,
  buildRobotsDirective,
  pathSuggestsNoIndex,
  buildDocumentSeoMeta,
  getSiteOrigin,
  SEO_MARKETS,
  preferredPathPrefix,
  buildMarketPath,
  htmlLangFromLanguage,
} from '~/lib/seo';
