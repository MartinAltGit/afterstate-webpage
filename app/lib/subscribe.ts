import {
  klaviyoListId,
  klaviyoPrivateKey,
  subscribeKlaviyoProfile,
  type KlaviyoEnv,
} from '~/lib/klaviyo';

export type SubscribeIntent = 'newsletter' | 'demand';

export type SubscribePayload = {
  email: string;
  intent: SubscribeIntent;
  productHandle?: string;
  productTitle?: string;
  source?: string;
};

export type SubscribeResult =
  | {ok: true}
  | {ok: false; error: string};

export type SubscribeEnv = KlaviyoEnv & {
  NEWSLETTER_WEBHOOK_URL?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNAVAILABLE =
  'Subscriptions are temporarily unavailable. Try again later.';
const GENERIC_ERROR = 'Something went wrong. Try again in a moment.';

/**
 * Normalize and validate an email for newsletter / demand capture.
 */
export function parseSubscribeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function parseSubscribeIntent(raw: unknown): SubscribeIntent {
  return raw === 'demand' ? 'demand' : 'newsletter';
}

/**
 * Capture an email for marketing / demand lists.
 * Prefers Klaviyo (private API key + list ID). Falls back to
 * NEWSLETTER_WEBHOOK_URL. Fails closed when neither is configured.
 */
export async function captureSubscription(
  payload: SubscribePayload,
  env: SubscribeEnv,
): Promise<SubscribeResult> {
  const klaviyoKey = klaviyoPrivateKey(env);

  if (klaviyoKey) {
    return captureViaKlaviyo(payload, env, klaviyoKey);
  }

  const webhook = env.NEWSLETTER_WEBHOOK_URL?.trim();
  if (webhook) {
    return captureViaWebhook(payload, webhook);
  }

  console.warn(
    '[subscribe] Klaviyo / NEWSLETTER_WEBHOOK_URL is not configured; refusing capture',
    {intent: payload.intent, source: payload.source ?? null},
  );
  return {ok: false, error: UNAVAILABLE};
}

async function captureViaKlaviyo(
  payload: SubscribePayload,
  env: SubscribeEnv,
  apiKey: string,
): Promise<SubscribeResult> {
  const listId = klaviyoListId(payload.intent, env);

  if (!listId) {
    console.warn(
      '[subscribe] KLAVIYO_NEWSLETTER_LIST_ID is not configured; refusing capture',
      {intent: payload.intent},
    );
    return {ok: false, error: UNAVAILABLE};
  }

  const result = await subscribeKlaviyoProfile(
    {
      email: payload.email,
      listId,
      customSource: klaviyoCustomSource(payload),
      properties: klaviyoProperties(payload),
    },
    apiKey,
  );

  if (!result.ok) {
    return {ok: false, error: GENERIC_ERROR};
  }

  return {ok: true};
}

function klaviyoCustomSource(payload: SubscribePayload): string {
  const source = payload.source?.trim() || payload.intent;
  return `afterstate:${source}`;
}

function klaviyoProperties(payload: SubscribePayload): Record<string, string> {
  const properties: Record<string, string> = {
    signup_intent: payload.intent,
  };
  if (payload.source) properties.signup_source = payload.source;
  if (payload.productHandle) {
    properties.demand_product_handle = payload.productHandle;
  }
  if (payload.productTitle) {
    properties.demand_product_title = payload.productTitle;
  }
  return properties;
}

async function captureViaWebhook(
  payload: SubscribePayload,
  webhook: string,
): Promise<SubscribeResult> {
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        capturedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[subscribe] webhook failed', response.status);
      return {ok: false, error: GENERIC_ERROR};
    }

    return {ok: true};
  } catch (error) {
    console.error('[subscribe] webhook error', error);
    return {ok: false, error: GENERIC_ERROR};
  }
}
