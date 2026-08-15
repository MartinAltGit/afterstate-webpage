/**
 * Shared Shopify Admin GraphQL helpers for blog automation.
 *
 * Auth (either):
 *   SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET  (Dev Dashboard — preferred)
 *   SHOPIFY_ADMIN_TOKEN                         (legacy shpat_ custom-app token)
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-10';

let cachedAccessToken = null;

function normalizeShop() {
  return (process.env.SHOPIFY_SHOP || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/\.myshopify\.com$/i, '');
}

function looksLikeLegacyAdminToken(token) {
  return /^shp(at|ca|ss)_/i.test(token);
}

export function describeShopifyAuth() {
  const staticToken = (process.env.SHOPIFY_ADMIN_TOKEN || '').trim();
  const clientId = (process.env.SHOPIFY_CLIENT_ID || '').trim();
  const clientSecret = (process.env.SHOPIFY_CLIENT_SECRET || '').trim();

  if (looksLikeLegacyAdminToken(staticToken)) return 'admin_token';
  if (clientId && clientSecret) return 'client_credentials';
  if (staticToken) return 'admin_token';
  return 'missing';
}

async function getAccessToken(shop) {
  if (cachedAccessToken) return cachedAccessToken;

  const staticToken = (process.env.SHOPIFY_ADMIN_TOKEN || '').trim();
  const clientId = (process.env.SHOPIFY_CLIENT_ID || '').trim();
  const clientSecret = (process.env.SHOPIFY_CLIENT_SECRET || '').trim();

  // Prefer Dev Dashboard client credentials unless a real shpat_/shpca_ token is set.
  // A leftover placeholder in SHOPIFY_ADMIN_TOKEN must not block the exchange.
  if (looksLikeLegacyAdminToken(staticToken)) {
    cachedAccessToken = staticToken;
    return cachedAccessToken;
  }

  if (clientId && clientSecret) {
    const response = await fetch(
      `https://${shop}.myshopify.com/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      },
    );
    const json = await response.json().catch(() => ({}));
    if (!response.ok || !json.access_token) {
      throw new Error(
        `Shopify token exchange failed (${response.status}): ${JSON.stringify(json)}`,
      );
    }
    cachedAccessToken = json.access_token;
    return cachedAccessToken;
  }

  if (staticToken) {
    cachedAccessToken = staticToken;
    return cachedAccessToken;
  }

  throw new Error(
    'Missing Shopify auth. Set SHOPIFY_SHOP plus SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (Dev Dashboard) or a shpat_ SHOPIFY_ADMIN_TOKEN.',
  );
}

export async function getAdminConfig() {
  const shop = normalizeShop();
  if (!shop) {
    throw new Error(
      'Missing SHOPIFY_SHOP (e.g. your-store or your-store.myshopify.com)',
    );
  }

  const token = await getAccessToken(shop);
  return {
    shop,
    token,
    endpoint: `https://${shop}.myshopify.com/admin/api/${API_VERSION}/graphql.json`,
  };
}

export async function adminGraphql(query, variables = {}) {
  const {endpoint, token} = await getAdminConfig();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({query, variables}),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Admin API HTTP ${response.status}: ${JSON.stringify(json)}`,
    );
  }

  if (json.errors?.length) {
    throw new Error(`Admin GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

export function slugifyHandle(input) {
  return String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
