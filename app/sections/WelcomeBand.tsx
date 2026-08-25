import {MagneticLink} from '~/components/motion/MagneticLink';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {WELCOME_DISCOUNT_CODE} from '~/lib/welcomeOffer';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './WelcomeBand.module.css';

/**
 * First-order offer strip — Pinterest promo-band layout, Afterstate materials.
 */
export function WelcomeBand({className}: {className?: string}) {
  const localePrefix = useLocalePathPrefix();
  const copy = useUiCopy();
  const shopPath = prefixPathWithLocale('/shop', localePrefix);
  const applyTo = `/discount/${WELCOME_DISCOUNT_CODE}?redirect=${encodeURIComponent(shopPath)}`;

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="welcome-band-title"
    >
      <div className={styles.inner}>
        <div className={styles.mark} aria-hidden="true">
          20%
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{copy.welcome.kicker.trim()}</p>
          <h2 id="welcome-band-title" className={styles.title}>
            {copy.welcome.offer}
          </h2>
        </div>
        <MagneticLink
          className={styles.cta}
          variant="solid"
          to={prefixPathWithLocale(applyTo, localePrefix)}
        >
          {copy.welcome.apply} {WELCOME_DISCOUNT_CODE}
        </MagneticLink>
      </div>
    </section>
  );
}
