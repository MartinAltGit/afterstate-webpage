import {redirect, type LoaderFunctionArgs} from 'react-router';
import {isKnownLocaleSegment} from '~/lib/i18n';

export async function loader({params, request}: LoaderFunctionArgs) {
  const localeParam = params.locale?.toLowerCase().replace(/\.data$/, '');

  if (!localeParam) {
    return null;
  }

  // Duplicate of default EN-EU market — consolidate to unprefixed URLs.
  if (localeParam === 'en-eu' || localeParam === 'en-nl') {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\.data$/i, '');
    const stripped =
      pathname.replace(new RegExp(`^/${localeParam}(?=/|$)`, 'i'), '') || '/';
    throw redirect(`${stripped}${url.search}`, 301);
  }

  if (!isKnownLocaleSegment(localeParam)) {
    throw new Response(null, {status: 404});
  }

  return null;
}
