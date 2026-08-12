export type {AlternateLanguage} from './url';
export {buildCanonicalUrl, stripTrackingParams} from './url';

export {
  buildPageTitle,
  buildMetaTags,
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
  buildDocumentSeoMeta,
  type SiteOriginEnv,
  type DocumentSeoInput,
} from './document';
