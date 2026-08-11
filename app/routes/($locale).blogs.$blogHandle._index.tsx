import {redirect} from 'react-router';
import type {Route} from './+types/($locale).blogs.$blogHandle._index';
import {
  FASHION_BLOG_HANDLE,
  JOURNAL_BLOG_HANDLE,
  blogIndexPath,
} from '~/lib/content-paths';
import type {I18nLocale} from '~/lib/i18n';

/**
 * Legacy Shopify blog index URLs under /blogs/:blogHandle.
 * Journal → `/journal`, fashion Blog → `/blog`.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  const {blogHandle} = params;
  const pathPrefix = (context.storefront.i18n as I18nLocale).pathPrefix || '';

  if (!blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const normalized = blogHandle.toLowerCase();
  if (
    normalized === JOURNAL_BLOG_HANDLE ||
    normalized === FASHION_BLOG_HANDLE
  ) {
    throw redirect(`${pathPrefix}${blogIndexPath(normalized)}`);
  }

  throw redirect(`${pathPrefix}/blog`);
}
