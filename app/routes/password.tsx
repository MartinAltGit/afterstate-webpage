import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router';
import type {Route} from './+types/password';
import {BrandLogo} from '~/components/brand/BrandLogo';
import pageStyles from '~/components/content/QuietPage.module.css';
import {
  isStorefrontUnlocked,
  safeStorefrontReturnTo,
  STOREFRONT_UNLOCK_SESSION_KEY,
  storefrontPasswordFromEnv,
  storefrontPasswordMatches,
  storefrontUnlockToken,
} from '~/lib/storefront-password';
import styles from '~/styles/PasswordGate.module.css';

export const meta: Route.MetaFunction = () => [
  {title: 'Afterstate'},
  {name: 'robots', content: 'noindex, nofollow, noarchive'},
];

export async function loader({request, context}: Route.LoaderArgs) {
  const password = storefrontPasswordFromEnv(context.env);
  if (!password) throw redirect('/');

  if (await isStorefrontUnlocked(context.session, password)) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  return {
    returnTo: safeStorefrontReturnTo(url.searchParams.get('returnTo')),
  };
}

export async function action({request, context}: Route.ActionArgs) {
  const password = storefrontPasswordFromEnv(context.env);
  if (!password) throw redirect('/');

  const form = await request.formData();
  const submitted = String(form.get('password') || '');
  const returnTo = safeStorefrontReturnTo(form.get('returnTo'));

  if (!(await storefrontPasswordMatches(submitted, password))) {
    return {ok: false as const, error: 'That password is not right.'};
  }

  context.session.set(
    STOREFRONT_UNLOCK_SESSION_KEY,
    await storefrontUnlockToken(password),
  );

  return redirect(returnTo, {
    headers: {
      'X-Remix-Reload-Document': 'true',
    },
  });
}

export default function PasswordGatePage() {
  const {returnTo} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const error =
    actionData && 'error' in actionData ? actionData.error : null;

  return (
    <div className={`${pageStyles.world} ${styles.screen}`}>
      <div className={`${pageStyles.root} ${pageStyles.alignCenter} ${styles.panel}`}>
        <BrandLogo variant="wordmark" size="lg" title="Afterstate" />
        <header className={pageStyles.intro}>
          <p className={pageStyles.eyebrow}>Private preview</p>
          <h1 className={pageStyles.title}>Not open yet</h1>
          <p className={pageStyles.lede}>
            This store is temporarily closed while we finish the next drop.
          </p>
        </header>

        <Form
          method="post"
          className={`${pageStyles.form} ${styles.form}`}
          reloadDocument
        >
          <input type="hidden" name="returnTo" value={returnTo} />
          <label className={pageStyles.field}>
            <span className={pageStyles.fieldLabel}>Password</span>
            <input
              className={pageStyles.fieldControl}
              type="password"
              name="password"
              autoComplete="current-password"
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'password-error' : undefined}
            />
          </label>
          {error ? (
            <p className={styles.error} role="alert" id="password-error">
              {error}
            </p>
          ) : null}
          <button className={pageStyles.submit} type="submit" disabled={submitting}>
            {submitting ? 'Entering…' : 'Enter'}
          </button>
        </Form>
      </div>
    </div>
  );
}

export function headers() {
  return {
    'Cache-Control': 'private, no-store, must-revalidate',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  };
}
