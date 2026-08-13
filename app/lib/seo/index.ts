export type {AlternateLanguage} from './url';
export {buildCanonicalUrl, stripTrackingParams} from './url';

export {
  buildPageTitle,
  buildMetaTags,
  clampSeoText,
  SEO_TITLE_MAX_LENGTH,
  SEO_DESCRIPTION_MAX_LENGTH,
  DEFAULT_SEO_DESCRIPTION,
  type SeoMetaInput,
  type MetaDescriptor,
} from './meta';

export {
  shouldNoIndex,
  buildRobotsDirective,
  pathSuggestsNoIndex,
  robotsPolicyForPath,
  DEFAULT_NOINDEX_PATH_PREFIXES,
  type RobotsDecisionInput,
  type PathRobotsPolicy,
} from './robots';

export {
  SEO_MARKETS,
  preferredPathPrefix,
  toLocaleAgnosticPath,
  buildMarketPath,
  buildHreflangAlternates,
  htmlLangFromLanguage,
  type SeoMarket,
} from './markets';

export {
  getSiteOrigin,
  requestWithSiteOrigin,
  buildDocumentSeoMeta,
  PUBLIC_SITE_HOST,
  PUBLIC_SITE_ORIGIN,
  type SiteOriginEnv,
  type DocumentSeoInput,
} from './document';

export {
  sitemapResourcePath,
  sitemapAbsoluteUrl,
  buildStaticSitemapXml,
  STATIC_SITEMAP_PATHS,
} from './sitemap';
