import {redirect, type LoaderFunctionArgs} from 'react-router';
import type {I18nLocale} from '~/lib/i18n';

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {pathPrefix, language, country} = context.storefront
    .i18n as I18nLocale;
  const localeParam = params.locale?.toLowerCase();

  if (!localeParam) {
    return null;
  }

  // Duplicate of default EN-EU market — consolidate to unprefixed URLs.
  if (localeParam === 'en-eu') {
    const url = new URL(request.url);
    const stripped = url.pathname.replace(/^\/en-eu(?=\/|$)/i, '') || '/';
    throw redirect(`${stripped}${url.search}`, 301);
  }

  // Prefer pathPrefix so pseudo-markets (en-eu → NL) still validate.
  const expectedFromPrefix = pathPrefix
    ? pathPrefix.replace(/^\//, '').toLowerCase()
    : null;
  const expectedFromCodes = `${language}-${country}`.toLowerCase();

  // Default market as /en-nl (EN+NL) is the same as `/` — consolidate.
  if (!expectedFromPrefix && localeParam === expectedFromCodes) {
    const url = new URL(request.url);
    const stripped =
      url.pathname.replace(
        new RegExp(`^/${localeParam}(?=/|$)`, 'i'),
        '',
      ) || '/';
    throw redirect(`${stripped}${url.search}`, 301);
  }

  if (
    localeParam !== expectedFromPrefix &&
    localeParam !== expectedFromCodes
  ) {
    // Locale segment present but does not match this request's market
    throw new Response(null, {status: 404});
  }

  return null;
}
