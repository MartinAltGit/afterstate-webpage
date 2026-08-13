import type {Route} from './+types/[sitemap-static.xml]';
import {buildStaticSitemapXml, getSiteOrigin} from '~/lib/seo';

export async function loader({request, context}: Route.LoaderArgs) {
  const origin = getSiteOrigin(context.env, request);
  const xml = buildStaticSitemapXml(origin || new URL(request.url).origin);

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
