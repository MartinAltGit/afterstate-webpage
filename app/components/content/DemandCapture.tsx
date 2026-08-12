import {useEffect, useId} from 'react';
import {useFetcher} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {AnalyticsEvents, track} from '~/lib/analytics/events';
import styles from './DemandCapture.module.css';

export type DemandCaptureProps = {
  productHandle: string;
  productTitle: string;
  className?: string;
};

type SubscribeActionData = {ok: true} | {ok: false; error: string};

/**
 * Sold-out / demand email capture — no login required.
 */
export function DemandCapture({
  productHandle,
  productTitle,
  className,
}: DemandCaptureProps) {
  const fetcher = useFetcher<SubscribeActionData>();
  const localePrefix = useLocalePathPrefix();
  const fieldId = useId();
  const busy = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const error =
    fetcher.data && fetcher.data.ok === false ? fetcher.data.error : null;

  useEffect(() => {
    if (succeeded) {
      track(AnalyticsEvents.NEWSLETTER_SUBSCRIBE, {
        source: 'demand',
        intent: 'demand',
        productHandle,
      });
    }
  }, [succeeded, productHandle]);

  if (succeeded) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <p className={styles.success} role="status">
          Demand noted. We&apos;ll reach out if this returns or a related drop
          lands.
        </p>
      </div>
    );
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <p className={styles.lead}>
        Want this? Leave your email — we register demand for restocks and related
        drops.
      </p>
      <fetcher.Form
        className={styles.form}
        method="post"
        action={prefixPathWithLocale('/subscribe', localePrefix)}
        noValidate
      >
        <input type="hidden" name="intent" value="demand" />
        <input type="hidden" name="source" value="product-demand" />
        <input type="hidden" name="productHandle" value={productHandle} />
        <input type="hidden" name="productTitle" value={productTitle} />
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
          {busy ? '…' : 'Make a demand'}
        </button>
      </fetcher.Form>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
