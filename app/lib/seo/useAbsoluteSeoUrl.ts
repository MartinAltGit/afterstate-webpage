import {useRouteLoaderData} from 'react-router';
import {
  buildCanonicalUrl,
  buildMarketPath,
  preferredPathPrefix,
} from '~/lib/seo';

type RootSeoData = {
  seo?: {
    origin: string;
    pathPrefix: string;
  };
};

/**
 * Absolute SEO URL for the current market (JSON-LD, share tags).
 * Falls back to a relative path when root SEO data is unavailable.
 */
export function useAbsoluteSeoUrl(localeAgnosticPath: string): string {
  const data = useRouteLoaderData('root') as RootSeoData | undefined;
  const origin = data?.seo?.origin;
  const prefix = preferredPathPrefix(data?.seo?.pathPrefix ?? '');
  const path = buildMarketPath(localeAgnosticPath, prefix);
  if (!origin) return path;
  return buildCanonicalUrl(origin, path);
}
