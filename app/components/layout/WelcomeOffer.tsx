import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {
  WELCOME_DISCOUNT_CODE,
  WELCOME_DISCOUNT_LABEL,
} from '~/lib/welcomeOffer';
import styles from './WelcomeOffer.module.css';

/**
 * Announcement-bar CTA that applies the welcome discount via /discount/:code.
 */
export function WelcomeOffer() {
  const localePrefix = useLocalePathPrefix();
  const shopPath = prefixPathWithLocale('/shop', localePrefix);

  return (
    <p className={styles.root}>
      <span className={styles.kicker}>New here? </span>
      <span className={styles.offer}>{WELCOME_DISCOUNT_LABEL}</span>
      <span className={styles.sep} aria-hidden="true">
        {' — '}
      </span>
      <LocaleAwareLink
        className={styles.link}
        prefetch="intent"
        to={`/discount/${WELCOME_DISCOUNT_CODE}?redirect=${encodeURIComponent(shopPath)}`}
      >
        Apply {WELCOME_DISCOUNT_CODE}
      </LocaleAwareLink>
    </p>
  );
}
