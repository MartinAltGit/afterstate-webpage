import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {
  WELCOME_DISCOUNT_CODE,
} from '~/lib/welcomeOffer';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './WelcomeOffer.module.css';

/**
 * Announcement-bar CTA that applies the welcome discount via /discount/:code.
 */
export function WelcomeOffer() {
  const localePrefix = useLocalePathPrefix();
  const copy = useUiCopy();
  const shopPath = prefixPathWithLocale('/shop', localePrefix);

  return (
    <p className={styles.root}>
      <span className={styles.kicker}>{copy.welcome.kicker}</span>
      <span className={styles.offer}>{copy.welcome.offer}</span>
      <span className={styles.sep} aria-hidden="true">
        {' — '}
      </span>
      <LocaleAwareLink
        className={styles.link}
        prefetch="intent"
        to={`/discount/${WELCOME_DISCOUNT_CODE}?redirect=${encodeURIComponent(shopPath)}`}
      >
        {copy.welcome.apply} {WELCOME_DISCOUNT_CODE}
      </LocaleAwareLink>
    </p>
  );
}
