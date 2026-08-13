import type {Route} from './+types/($locale).[sitemap.xml]';
import {getSitemapIndex} from '@shopify/hydrogen';
import {requestWithSiteOrigin} from '~/lib/seo';

export async function loader({request, context}: Route.LoaderArgs) {
  const sitemapRequest = requestWithSiteOrigin(request, context.env);
  const response = await getSitemapIndex({
    storefront: context.storefront,
    request: sitemapRequest,
    types: ['products', 'pages', 'collections', 'blogs', 'articles'],
    customChildSitemaps: ['/sitemap-static.xml'],
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);
  return response;
}
