import {redirect} from 'react-router';
import type {Route} from './+types/($locale).blogs.$blogHandle.$articleHandle';
import type {I18nLocale} from '~/lib/i18n';

/**
 * Legacy Shopify article URLs under /blogs/:blog/:article.
 * Journal articles live at `/journal/:articleHandle`.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;
  const pathPrefix = (context.storefront.i18n as I18nLocale).pathPrefix || '';

  if (!articleHandle) {
    throw new Response('Not found', {status: 404});
  }

  if (!blogHandle || blogHandle.toLowerCase() === 'journal') {
    throw redirect(`${pathPrefix}/journal/${articleHandle}`);
  }

  // Other blog handles still map into the journal article path when present
  throw redirect(`${pathPrefix}/journal/${articleHandle}`);
}
