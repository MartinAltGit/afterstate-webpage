import type {Route} from './+types/($locale).sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';

/** Europe-only market prefixes used in alternate sitemap URLs. */
const SITEMAP_LOCALES = ['EN-EU', 'EN-GB', 'DE-DE', 'FR-FR'] as const;

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: [...SITEMAP_LOCALES],
    getLink: ({type, baseUrl, handle, locale}) => {
      // Default EN-EU market has no path prefix (same as `/`).
      if (!locale || locale.toUpperCase() === 'EN-EU') {
        return `${baseUrl}/${type}/${handle}`;
      }
      return `${baseUrl}/${locale.toLowerCase()}/${type}/${handle}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
