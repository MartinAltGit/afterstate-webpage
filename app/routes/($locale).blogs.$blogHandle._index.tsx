import {redirect} from 'react-router';
import type {Route} from './+types/($locale).blogs.$blogHandle._index';
import type {I18nLocale} from '~/lib/i18n';

/**
 * Legacy Shopify blog URLs.
 * Journal content lives at `/journal` — redirect the journal handle there.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  const {blogHandle} = params;
  const pathPrefix = (context.storefront.i18n as I18nLocale).pathPrefix || '';

  if (!blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  if (blogHandle.toLowerCase() === 'journal') {
    throw redirect(`${pathPrefix}/journal`);
  }

  // Non-journal blogs are not part of Afterstate IA
  throw redirect(`${pathPrefix}/journal`);
}
