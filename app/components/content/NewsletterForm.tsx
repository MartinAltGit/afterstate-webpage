import {useEffect, useId} from 'react';
import {useFetcher} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {AnalyticsEvents, track} from '~/lib/analytics/events';
import type {SubscribeIntent} from '~/lib/subscribe';
import styles from './NewsletterForm.module.css';

export type NewsletterFormProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  note?: string;
  /** `full` = homepage/journal block; `footer` = compact dark footer column */
  variant?: 'full' | 'footer';
  intent?: SubscribeIntent;
  source?: string;
  className?: string;
};

type SubscribeActionData = {ok: true} | {ok: false; error: string};

/**
 * Newsletter / list signup — posts to /subscribe (no customer login).
 */
export function NewsletterForm({
  eyebrow = 'Stay close',
  title = 'Afterstate notes',
  description = 'Campaign drops, journal pieces, and quiet updates — no noise.',
  placeholder = 'Email address',
  submitLabel = 'Subscribe',
  note = 'By subscribing you agree to hear from Afterstate. Unsubscribe anytime.',
  variant = 'full',
  intent = 'newsletter',
  source = 'newsletter',
  className,
}: NewsletterFormProps) {
  const fetcher = useFetcher<SubscribeActionData>();
  const localePrefix = useLocalePathPrefix();
  const fieldId = useId();
  const busy = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const error =
    fetcher.data && fetcher.data.ok === false ? fetcher.data.error : null;

  useEffect(() => {
    if (succeeded) {
      track(AnalyticsEvents.NEWSLETTER_SUBSCRIBE, {source, intent});
    }
  }, [succeeded, source, intent]);

  const headingId = `${fieldId}-title`;

  return (
    <section
      className={[
        styles.root,
        variant === 'footer' ? styles.footer : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={variant === 'full' ? headingId : undefined}
      aria-label={variant === 'footer' ? 'Newsletter' : undefined}
    >
      <div className={styles.inner}>
        {variant === 'full' && eyebrow ? (
          <p className={styles.eyebrow}>{eyebrow}</p>
        ) : null}
        {variant === 'full' ? (
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
        ) : (
          <p className={styles.footerLead}>
            Drops, journal notes, and first looks — no noise.
          </p>
        )}
        {variant === 'full' && description ? (
          <p className={styles.description}>{description}</p>
        ) : null}

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
            <input type="hidden" name="intent" value={intent} />
            <input type="hidden" name="source" value={source} />
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
              placeholder={placeholder}
              disabled={busy}
            />
            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? '…' : submitLabel}
            </button>
          </fetcher.Form>
        )}

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        {!succeeded && note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  );
}
