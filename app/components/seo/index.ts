export {
  buildPageTitle,
  buildMetaTags,
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
  type OrganizationJsonLdProps,
  type ProductJsonLdProps,
  type ProductGroupJsonLdProps,
  type BreadcrumbJsonLdProps,
  type BreadcrumbJsonLdItem,
  type ArticleJsonLdProps,
} from './JsonLd';

export {
  buildCanonicalUrl,
  stripTrackingParams,
  shouldNoIndex,
  buildRobotsDirective,
  pathSuggestsNoIndex,
} from '~/lib/seo';
