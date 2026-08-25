/**
 * Server-only Klaviyo helpers for newsletter / demand capture.
 * Private key never leaves Oxygen / Mini Oxygen env — never prefix with PUBLIC_.
 *
 * @see https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api
 */

export const KLAVIYO_API_REVISION = '2026-07-15';
const KLAVIYO_API = 'https://a.klaviyo.com';

export type KlaviyoSubscribeInput = {
  email: string;
  /** Stored on the consent record (Klaviyo `custom_source`). */
  customSource: string;
  /** Custom profile properties (source, intent, product). */
  properties: Record<string, string>;
  /** Klaviyo list ID — required so “Added to list” flows fire. */
  listId: string;
};

export type KlaviyoEnv = {
  KLAVIYO_PRIVATE_API_KEY?: string;
  KLAVIYO_NEWSLETTER_LIST_ID?: string;
  KLAVIYO_DEMAND_LIST_ID?: string;
};

function klaviyoHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: KLAVIYO_API_REVISION,
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  };
}

export function klaviyoPrivateKey(env: KlaviyoEnv): string | null {
  const key = env.KLAVIYO_PRIVATE_API_KEY?.trim();
  return key || null;
}

export function klaviyoListId(
  intent: 'newsletter' | 'demand',
  env: KlaviyoEnv,
): string | null {
  const newsletter = env.KLAVIYO_NEWSLETTER_LIST_ID?.trim();
  const demand = env.KLAVIYO_DEMAND_LIST_ID?.trim();
  if (intent === 'demand') return demand || newsletter || null;
  return newsletter || null;
}

/**
 * Create/update the profile, then subscribe them to email marketing on `listId`.
 * Subscribe is the source of truth for consent; property upsert is best-effort.
 */
export async function subscribeKlaviyoProfile(
  input: KlaviyoSubscribeInput,
  apiKey: string,
): Promise<{ok: true} | {ok: false; status?: number}> {
  await upsertKlaviyoProfile(input, apiKey);

  const body: Record<string, unknown> = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: input.customSource,
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email: input.email,
                subscriptions: {
                  email: {
                    marketing: {consent: 'SUBSCRIBED'},
                  },
                },
              },
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {type: 'list', id: input.listId},
        },
      },
    },
  };

  try {
    const response = await fetch(
      `${KLAVIYO_API}/api/profile-subscription-bulk-create-jobs/`,
      {
        method: 'POST',
        headers: klaviyoHeaders(apiKey),
        body: JSON.stringify(body),
      },
    );

    // 202 = job accepted (list may use double opt-in; profile is not always
    // “subscribed” in the UI until they confirm).
    if (response.status === 202 || response.ok) {
      return {ok: true};
    }

    console.error('[klaviyo] subscribe failed', response.status);
    return {ok: false, status: response.status};
  } catch (error) {
    console.error('[klaviyo] subscribe error', error);
    return {ok: false};
  }
}

async function upsertKlaviyoProfile(
  input: KlaviyoSubscribeInput,
  apiKey: string,
): Promise<void> {
  if (Object.keys(input.properties).length === 0) return;

  try {
    const response = await fetch(`${KLAVIYO_API}/api/profile-import/`, {
      method: 'POST',
      headers: klaviyoHeaders(apiKey),
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: input.email,
            properties: input.properties,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error('[klaviyo] profile import failed', response.status);
    }
  } catch (error) {
    console.error('[klaviyo] profile import error', error);
  }
}
