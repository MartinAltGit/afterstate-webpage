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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
 * Posts to NEWSLETTER_WEBHOOK_URL when set (Zapier, Make, Klaviyo, etc.).
 * Fails closed when the webhook is missing so the UI never claims success
 * without storing the address.
 */
export async function captureSubscription(
  payload: SubscribePayload,
  env: {NEWSLETTER_WEBHOOK_URL?: string},
): Promise<SubscribeResult> {
  const webhook = env.NEWSLETTER_WEBHOOK_URL?.trim();

  if (!webhook) {
    console.warn(
      '[subscribe] NEWSLETTER_WEBHOOK_URL is not configured; refusing capture',
      {intent: payload.intent, source: payload.source ?? null},
    );
    return {
      ok: false,
      error: 'Subscriptions are temporarily unavailable. Try again later.',
    };
  }

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
      return {ok: false, error: 'Something went wrong. Try again in a moment.'};
    }

    return {ok: true};
  } catch (error) {
    console.error('[subscribe] webhook error', error);
    return {ok: false, error: 'Something went wrong. Try again in a moment.'};
  }
}
