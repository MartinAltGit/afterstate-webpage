/**
 * Shared Shopify Admin GraphQL helpers for blog automation.
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-10';

export function getAdminConfig() {
  const shop = (process.env.SHOPIFY_SHOP || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/\.myshopify\.com$/i, '');
  const token = process.env.SHOPIFY_ADMIN_TOKEN || '';

  if (!shop) {
    throw new Error(
      'Missing SHOPIFY_SHOP (e.g. your-store or your-store.myshopify.com)',
    );
  }
  if (!token) {
    throw new Error('Missing SHOPIFY_ADMIN_TOKEN (Admin API access token)');
  }

  return {
    shop,
    token,
    endpoint: `https://${shop}.myshopify.com/admin/api/${API_VERSION}/graphql.json`,
  };
}

export async function adminGraphql(query, variables = {}) {
  const {endpoint, token} = getAdminConfig();
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
