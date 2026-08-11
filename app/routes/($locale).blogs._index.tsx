import {redirect} from 'react-router';
import type {Route} from './+types/($locale).blogs._index';
import type {I18nLocale} from '~/lib/i18n';

/** Legacy `/blogs` index — fashion Blog lives at `/blog`. */
export async function loader({context}: Route.LoaderArgs) {
  const pathPrefix = (context.storefront.i18n as I18nLocale).pathPrefix || '';
  throw redirect(`${pathPrefix}/blog`);
}
