import {redirect} from 'react-router';
import type {Route} from './+types/($locale).blogs.$blogHandle.$articleHandle';
import {
  FASHION_BLOG_HANDLE,
  JOURNAL_BLOG_HANDLE,
  articlePath,
} from '~/lib/content-paths';
import type {I18nLocale} from '~/lib/i18n';

/**
 * Legacy Shopify article URLs under /blogs/:blog/:article.
 * Journal → `/journal/:handle`, fashion Blog → `/blog/:handle`.
 */
export async function loader({params, context}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;
  const pathPrefix = (context.storefront.i18n as I18nLocale).pathPrefix || '';

  if (!articleHandle) {
    throw new Response('Not found', {status: 404});
  }

  if (!blogHandle) {
    throw redirect(`${pathPrefix}/blog/${articleHandle}`);
  }

  const normalized = blogHandle.toLowerCase();
  if (
    normalized === JOURNAL_BLOG_HANDLE ||
    normalized === FASHION_BLOG_HANDLE
  ) {
    throw redirect(
      `${pathPrefix}${articlePath(normalized, articleHandle)}`,
    );
  }

  throw redirect(`${pathPrefix}/blog/${articleHandle}`);
}
