import type {Route} from './+types/($locale).sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';
import {requestWithSiteOrigin, sitemapAbsoluteUrl} from '~/lib/seo';

/** Europe-only market prefixes used in alternate sitemap URLs. */
const SITEMAP_LOCALES = ['EN-EU', 'EN-GB', 'DE-DE', 'FR-FR'] as const;

export async function loader({
  request,
  params,
  context,
}: Route.LoaderArgs) {
  const sitemapRequest = requestWithSiteOrigin(request, context.env);
  const response = await getSitemap({
    storefront: context.storefront,
    request: sitemapRequest,
    params,
    locales: [...SITEMAP_LOCALES],
    getLink: ({type, baseUrl, handle, locale}) =>
      sitemapAbsoluteUrl({type, baseUrl, handle, locale}),
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
