import type {ReactNode} from 'react';
import {BrandLogo} from '~/components/brand/BrandLogo';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageContainer} from '~/components/layout/PageContainer';
import styles from './SiteFooter.module.css';

export type FooterLink = {
  label: string;
  to: string;
};

const SHOP_LINKS: FooterLink[] = [
  {label: 'Shop', to: '/shop'},
  {label: 'Limited drops', to: '/collections'},
  {label: 'Afterstate 001', to: '/collections/afterstate-001'},
  {label: 'Journal', to: '/journal'},
  {label: 'Blog', to: '/blog'},
  {label: 'About', to: '/about'},
];

const SUPPORT_LINKS: FooterLink[] = [
  {label: 'Size guide', to: '/size-guide'},
  {label: 'Care', to: '/care'},
  {label: 'Shipping & returns', to: '/shipping-returns'},
  {label: 'Contact', to: '/contact'},
  {label: 'Policies', to: '/policies'},
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
          <div className={styles.brand}>
            <LocaleAwareLink
              className={styles.brandLink}
              prefetch="intent"
              to="/"
              aria-label="Afterstate home"
            >
              <BrandLogo size="lg" />
              <span className={styles.wordmark}>Afterstate</span>
            </LocaleAwareLink>
            <p className={styles.tagline}>Life beyond the rush.</p>
          </div>

          <nav className={styles.column} aria-label="Shop">
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
          </nav>

          <nav className={styles.column} aria-label="Support">
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
          </nav>

          <div className={styles.column}>
            <p className={styles.heading}>Newsletter</p>
            {newsletter ?? (
              <p className={styles.newsletterPlaceholder}>
                Join for drops and journal notes.
              </p>
            )}
          </div>
        </div>

        <div className={styles.meta}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Afterstate
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
