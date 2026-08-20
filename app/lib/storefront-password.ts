/**
 * Temporary storefront password gate.
 *
 * Set `STOREFRONT_PASSWORD` (server-only — never `PUBLIC_`) to lock the
 * Hydrogen storefront. Unset it to open the store again.
 */

export const STOREFRONT_PASSWORD_PATH = '/password';
export const STOREFRONT_UNLOCK_SESSION_KEY = 'storefrontUnlock';

const UNLOCK_TOKEN_PREFIX = 'afterstate-storefront:';

type SessionReader = {
  get: (key: string) => unknown;
};

export function storefrontPasswordFromEnv(env: {
  STOREFRONT_PASSWORD?: string;
}): string {
  return env.STOREFRONT_PASSWORD?.trim() ?? '';
}

export function isStorefrontPasswordEnabled(env: {
  STOREFRONT_PASSWORD?: string;
}): boolean {
  return storefrontPasswordFromEnv(env).length > 0;
}

export function isStorefrontPasswordPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === STOREFRONT_PASSWORD_PATH;
}

/** Paths that must stay reachable while the rest of the store is locked. */
export function isStorefrontPasswordExemptPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (isStorefrontPasswordPath(path)) return true;
  if (path === '/robots.txt') return true;
  return false;
}

/**
 * Same-origin relative path only. Blocks open redirects and looping
 * back to the password form.
 */
export function safeStorefrontReturnTo(value: unknown): string {
  if (typeof value !== 'string') return '/';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/';
  if (trimmed.includes('\\') || trimmed.includes('://')) return '/';

  const pathOnly = trimmed.split('?')[0]?.replace(/\/+$/, '') || '/';
  if (pathOnly === STOREFRONT_PASSWORD_PATH) return '/';
  return trimmed;
}

export async function storefrontUnlockToken(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${UNLOCK_TOKEN_PREFIX}${password}`),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function timingSafeEqualHex(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function storefrontPasswordMatches(
  candidate: string,
  expected: string,
): Promise<boolean> {
  const [left, right] = await Promise.all([
    storefrontUnlockToken(candidate),
    storefrontUnlockToken(expected),
  ]);
  return timingSafeEqualHex(left, right);
}

export async function isStorefrontUnlocked(
  session: SessionReader,
  password: string,
): Promise<boolean> {
  const expected = await storefrontUnlockToken(password);
  const actual = session.get(STOREFRONT_UNLOCK_SESSION_KEY);
  return typeof actual === 'string' && timingSafeEqualHex(actual, expected);
}

export function storefrontPasswordRedirect(request: Request): Response {
  const url = new URL(request.url);
  const dest = new URL(STOREFRONT_PASSWORD_PATH, url.origin);
  const returnTo = safeStorefrontReturnTo(`${url.pathname}${url.search}`);
  if (returnTo !== '/') dest.searchParams.set('returnTo', returnTo);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${dest.pathname}${dest.search}`,
      'Cache-Control': 'private, no-store, must-revalidate',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}

export function applyStorefrontPasswordResponseHeaders(headers: Headers) {
  headers.set('Cache-Control', 'private, no-store, must-revalidate');
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
}

/**
 * Block unauthenticated storefront traffic when a password is configured.
 * Returns a redirect, or `null` to continue the request.
 */
export async function gateStorefrontPassword(
  request: Request,
  env: {STOREFRONT_PASSWORD?: string},
  session: SessionReader,
): Promise<Response | null> {
  const password = storefrontPasswordFromEnv(env);
  if (!password) return null;

  const url = new URL(request.url);
  if (isStorefrontPasswordExemptPath(url.pathname)) return null;
  if (await isStorefrontUnlocked(session, password)) return null;

  return storefrontPasswordRedirect(request);
}

export function closedStoreRobotsTxt(): string {
  return `User-agent: *
Disallow: /
`.trim();
}
