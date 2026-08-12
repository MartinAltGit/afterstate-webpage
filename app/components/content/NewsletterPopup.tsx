import {useEffect, useId, useState} from 'react';
import {useFetcher} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {AnalyticsEvents, track} from '~/lib/analytics/events';
import styles from './NewsletterPopup.module.css';

const STORAGE_KEY = 'afterstate.newsletterPopup';
const APPEAR_DELAY_MS = 5200;
const SUCCESS_DISMISS_MS = 2800;

type SubscribeActionData = {ok: true} | {ok: false; error: string};
type Phase = 'hidden' | 'entering' | 'open' | 'leaving';

function wasDismissed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {dismissedAt?: number; subscribed?: boolean};
    return Boolean(parsed.dismissedAt || parsed.subscribed);
  } catch {
    return false;
  }
}

function persistDismissed(subscribed = false) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({dismissedAt: Date.now(), subscribed}),
    );
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * Floating bottom-right newsletter CTA — brass outline, delayed entrance.
 */
export function NewsletterPopup() {
  const fetcher = useFetcher<SubscribeActionData>();
  const localePrefix = useLocalePathPrefix();
  const fieldId = useId();
  const titleId = `${fieldId}-title`;
  const [phase, setPhase] = useState<Phase>('hidden');
  const [enabled, setEnabled] = useState(false);

  const busy = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const error =
    fetcher.data && fetcher.data.ok === false ? fetcher.data.error : null;

  useEffect(() => {
    if (wasDismissed()) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const revealTimer = window.setTimeout(() => {
      setEnabled(true);
      setPhase(reduceMotion ? 'open' : 'entering');
    }, APPEAR_DELAY_MS);

    return () => window.clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'entering') return;
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setPhase('open'));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [phase]);

  useEffect(() => {
    if (!succeeded) return;
    track(AnalyticsEvents.NEWSLETTER_SUBSCRIBE, {
      source: 'popup',
      intent: 'newsletter',
    });
    persistDismissed(true);
    const timer = window.setTimeout(() => setPhase('leaving'), SUCCESS_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [succeeded]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    const timer = window.setTimeout(() => {
      setEnabled(false);
      setPhase('hidden');
    }, 320);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'open' && phase !== 'entering') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      persistDismissed(false);
      setPhase('leaving');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  function dismiss() {
    persistDismissed(succeeded);
    setPhase('leaving');
  }

  if (!enabled || phase === 'hidden') return null;

  return (
    <div
      className={[
        styles.root,
        phase === 'open' || phase === 'leaving' ? styles.open : null,
        phase === 'leaving' ? styles.leaving : null,
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={styles.close}
        onClick={dismiss}
        aria-label="Dismiss newsletter signup"
      >
        <span aria-hidden="true">×</span>
      </button>

      <p className={styles.eyebrow}>Newsletter</p>
      <h2 id={titleId} className={styles.title}>
        New drops &amp; news
      </h2>

      {succeeded ? (
        <p className={styles.success} role="status">
          You&apos;re in. We&apos;ll be in touch.
        </p>
      ) : (
        <fetcher.Form
          className={styles.form}
          method="post"
          action={prefixPathWithLocale('/subscribe', localePrefix)}
          noValidate
        >
          <input type="hidden" name="intent" value="newsletter" />
          <input type="hidden" name="source" value="popup" />
          <label className={styles.label} htmlFor={fieldId}>
            Email
          </label>
          <input
            id={fieldId}
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Email address"
            disabled={busy}
          />
          <button type="submit" className={styles.submit} disabled={busy}>
            {busy ? '…' : 'Join'}
          </button>
        </fetcher.Form>
      )}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {!succeeded ? (
        <p className={styles.note}>Unsubscribe anytime.</p>
      ) : null}
    </div>
  );
}
