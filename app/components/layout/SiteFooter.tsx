import type {ReactNode} from 'react';
import {BrandLogo} from '~/components/brand/BrandLogo';
import {SocialLinks} from '~/components/brand/SocialLinks';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageContainer} from '~/components/layout/PageContainer';
import {Reveal} from '~/components/motion/Reveal';
import styles from './SiteFooter.module.css';

export type FooterLink = {
  label: string;
  to: string;
};

const SHOP_LINKS: FooterLink[] = [
  {label: 'Shop', to: '/shop'},
  {label: 'Limited drops', to: '/collections'},
  {label: 'Afterstate 001', to: '/afterstate-001-no-rush'},
  {label: 'Journal', to: '/journal'},
  {label: 'Blog', to: '/blog'},
  {label: 'About', to: '/about'},
];

const SUPPORT_LINKS: FooterLink[] = [
  {label: 'Size guide', to: '/size-guide'},
  {label: 'Care', to: '/care'},
  {label: 'Shipping & returns', to: '/shipping-returns'},
  {label: 'Contact', to: '/contact'},
  {label: 'Privacy', to: '/policies/privacy-policy'},
  {label: 'Terms', to: '/policies/terms-of-service'},
  {label: 'Refunds', to: '/policies/refund-policy'},
  {label: 'Copyright', to: '/copyright'},
];

type SiteFooterProps = {
  newsletter?: ReactNode;
  className?: string;
};

/**
 * Afterstate site footer — tagline, editorial links, newsletter slot.
 */
export function SiteFooter({newsletter, className}: SiteFooterProps) {
  return (
    <footer className={[styles.root, className].filter(Boolean).join(' ')}>
      <PageContainer>
        <div className={styles.grid}>
          <Reveal className={styles.brand}>
            <LocaleAwareLink
              className={styles.brandLink}
              prefetch="intent"
              to="/"
              aria-label="Afterstate home"
            >
              <BrandLogo variant="wordmark" size="lg" />
            </LocaleAwareLink>
            <p className={styles.tagline}>Life beyond the rush.</p>
          </Reveal>

          <Reveal as="nav" className={styles.column} delayMs={70} aria-label="Shop">
            <p className={styles.heading}>Explore</p>
            <ul className={styles.list}>
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <LocaleAwareLink
                    className={styles.link}
                    prefetch="intent"
                    to={link.to}
                  >
                    {link.label}
                  </LocaleAwareLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            as="nav"
            className={styles.column}
            delayMs={120}
            aria-label="Support"
          >
            <p className={styles.heading}>Support</p>
            <ul className={styles.list}>
              {SUPPORT_LINKS.map((link) => (
                <li key={link.to}>
                  <LocaleAwareLink
                    className={styles.link}
                    prefetch="intent"
                    to={link.to}
                  >
                    {link.label}
                  </LocaleAwareLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={styles.newsletter} delayMs={160}>
            <p className={styles.heading}>Newsletter</p>
            {newsletter ?? (
              <p className={styles.newsletterPlaceholder}>
                Join for drops and journal notes.
              </p>
            )}
          </Reveal>
        </div>

        <Reveal delayMs={200} className={styles.bar}>
          <LocaleAwareLink
            className={styles.barLogo}
            prefetch="intent"
            to="/"
            aria-label="Afterstate home"
          >
            <BrandLogo variant="wordmark" size="md" />
          </LocaleAwareLink>
          <SocialLinks />
        </Reveal>

        <Reveal delayMs={240} className={styles.meta}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Afterstate. All rights reserved.
            London, United Kingdom.
          </p>
          <nav className={styles.legalNav} aria-label="Legal">
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/policies/privacy-policy"
            >
              Privacy
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/policies/terms-of-service"
            >
              Terms
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/policies/shipping-policy"
            >
              Shipping
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/copyright"
            >
              Copyright
            </LocaleAwareLink>
          </nav>
        </Reveal>
      </PageContainer>
    </footer>
  );
}
