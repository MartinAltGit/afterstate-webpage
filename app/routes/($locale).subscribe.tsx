import type {Route} from './+types/($locale).subscribe';
import {
  captureSubscription,
  parseSubscribeEmail,
  parseSubscribeIntent,
} from '~/lib/subscribe';

/**
 * Resource route for newsletter + demand email capture (no customer login).
 */
export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ok: false, error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  const email = parseSubscribeEmail(form.get('email'));

  if (!email) {
    return Response.json(
      {ok: false, error: 'Enter a valid email address.'},
      {status: 400},
    );
  }

  const intent = parseSubscribeIntent(form.get('intent'));
  const productHandle = String(form.get('productHandle') || '').trim() || undefined;
  const productTitle = String(form.get('productTitle') || '').trim() || undefined;
  const source = String(form.get('source') || '').trim() || undefined;

  const result = await captureSubscription(
    {email, intent, productHandle, productTitle, source},
    context.env,
  );

  return Response.json(result, {status: result.ok ? 200 : 502});
}

export async function loader() {
  return Response.json({ok: false, error: 'Use POST'}, {status: 405});
}
