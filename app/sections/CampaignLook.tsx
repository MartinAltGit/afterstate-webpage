import {MagneticLink} from '~/components/motion/MagneticLink';
import {Reveal} from '~/components/motion/Reveal';
import {
  pathnameWithoutLocale,
  prefixPathWithLocale,
  useLocalePathPrefix,
} from '~/lib/locale';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './CampaignLook.module.css';

/**
 * Closing campaign band — shown under page content, skipped where the
 * look already appears mid-page or the chrome is account/cart/legal.
 */
export function shouldShowClosingCampaignLook(pathname: string) {
  const path = pathnameWithoutLocale(pathname);

  if (path === '/') return false;
  if (path === '/collections') return false;
  if (path === '/afterstate-001-no-rush') return false;
  if (path === '/cart' || path.startsWith('/cart/')) return false;
  if (path.startsWith('/account')) return false;
  if (path.startsWith('/discount/')) return false;
  if (path === '/copyright' || path.startsWith('/policies')) return false;
  if (path.startsWith('/products/')) return false;
  /* Article pages carry their own look-ad rail. */
  if (path.startsWith('/blog/') && path !== '/blog/') return false;

  return true;
}

export type CampaignLookProps = {
  imageSrc: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  caption?: string;
  ctaLabel?: string;
  ctaTo?: string;
  className?: string;
};

/**
 * Immersive campaign band — large type, one clear CTA, full-bleed look.
 */
export function CampaignLook({
  imageSrc,
  eyebrow,
  title,
  accent,
  caption,
  ctaLabel,
  ctaTo = '/shop',
  className,
}: CampaignLookProps) {
  const localePrefix = useLocalePathPrefix();
  const copy = useUiCopy();
  const resolvedEyebrow = eyebrow ?? copy.landing.campaignEyebrow;
  const resolvedTitle = title ?? copy.landing.campaignTitle;
  const resolvedAccent = accent ?? copy.landing.campaignAccent;
  const resolvedCaption = caption ?? copy.landing.campaignCaption;
  const resolvedCta = ctaLabel ?? copy.landing.campaignCta;

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="campaign-look-title"
    >
      <Reveal as="figure" className={styles.figure} delayMs={60}>
        <div className={styles.frame}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={copy.landing.campaignImageAlt}
            width={3168}
            height={1344}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} aria-hidden="true" />
          <div className={styles.copy}>
            {resolvedEyebrow ? (
              <p className={styles.eyebrow}>{resolvedEyebrow}</p>
            ) : null}
            <h2 id="campaign-look-title" className={styles.title}>
              {resolvedTitle}
              {resolvedAccent ? (
                <>
                  <br />
                  <span className={styles.accent}>{resolvedAccent}</span>
                </>
              ) : null}
            </h2>
            {resolvedCaption ? (
              <p className={styles.caption}>{resolvedCaption}</p>
            ) : null}
            {resolvedCta && ctaTo ? (
              <MagneticLink
                className={styles.cta}
                variant="bright"
                to={prefixPathWithLocale(ctaTo, localePrefix)}
              >
                {resolvedCta}
              </MagneticLink>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

