import type {Route} from './+types/[robots.txt]';
import {getSiteOrigin} from '~/lib/seo';

export function loader({request, context}: Route.LoaderArgs) {
  const origin = getSiteOrigin(context.env, request);
  const body = robotsTxtData({url: origin || undefined});

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',

      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({url}: {url?: string}) {
  const sitemapUrl = url ? `${url.replace(/\/$/, '')}/sitemap.xml` : undefined;

  return `
User-agent: *
${generalDisallowRules({sitemapUrl})}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /cart
Disallow: /account
Disallow: /search
Disallow: /orders
Disallow: /*/cart
Disallow: /*/account
Disallow: /*/search
Disallow: /*/orders

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl})}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({sitemapUrl})}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

/**
 * Afterstate robots defaults: disallow cart, account, search, and orders;
 * allow the rest of the public storefront. Locale-prefixed paths included.
 */
function generalDisallowRules({sitemapUrl}: {sitemapUrl?: string}) {
  return `Disallow: /cart
Disallow: /account
Disallow: /search
Disallow: /orders
Disallow: /*/cart
Disallow: /*/account
Disallow: /*/search
Disallow: /*/orders
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: /*/collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /policies/
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}
