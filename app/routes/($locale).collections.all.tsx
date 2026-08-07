import {redirect} from 'react-router';
import type {Route} from './+types/($locale).collections.all';
import type {I18nLocale} from '~/lib/i18n';

/**
 * Legacy catalog URL → Afterstate /shop.
 */
export async function loader({context}: Route.LoaderArgs) {
  const i18n = context.storefront.i18n as I18nLocale;
  const pathPrefix = i18n.pathPrefix || '';
  throw redirect(`${pathPrefix}/shop`);
}
