import type {ReactNode} from 'react';
import {BrandLogo} from '~/components/brand/BrandLogo';
import {SocialLinks} from '~/components/brand/SocialLinks';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageContainer} from '~/components/layout/PageContainer';
import {Reveal} from '~/components/motion/Reveal';
import {SUPPORT_EMAIL, SUPPORT_MAILTO} from '~/lib/contact';
import {useUiCopy, type UiCopy} from '~/lib/ui-copy';
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
  const copy = useUiCopy();

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
            <p className={styles.tagline}>{copy.footer.tagline}</p>
          </Reveal>

          <Reveal as="nav" className={styles.column} delayMs={70} aria-label={copy.footer.explore}>
            <p className={styles.heading}>{copy.footer.explore}</p>
            <ul className={styles.list}>
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <LocaleAwareLink
                    className={styles.link}
                    prefetch="intent"
                    to={link.to}
                  >
                    {footerLabel(link.to, copy)}
                  </LocaleAwareLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            as="nav"
            className={styles.column}
            delayMs={120}
            aria-label={copy.footer.support}
          >
            <p className={styles.heading}>{copy.footer.support}</p>
            <ul className={styles.list}>
              {SUPPORT_LINKS.map((link) => (
                <li key={link.to}>
                  <LocaleAwareLink
                    className={styles.link}
                    prefetch="intent"
                    to={link.to}
                  >
                    {footerLabel(link.to, copy)}
                  </LocaleAwareLink>
                </li>
              ))}
              <li>
                <a className={styles.link} href={SUPPORT_MAILTO}>
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal className={styles.newsletter} delayMs={160}>
            <p className={styles.heading}>{copy.footer.newsletter}</p>
            {newsletter ?? (
              <p className={styles.newsletterPlaceholder}>
                {copy.footer.newsletterHint}
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
            © {new Date().getFullYear()} Afterstate. {copy.footer.rights}
            London, United Kingdom.
          </p>
          <nav className={styles.legalNav} aria-label="Legal">
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/policies/privacy-policy"
            >
              {copy.footer.privacy}
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/policies/terms-of-service"
            >
              {copy.footer.terms}
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/policies/shipping-policy"
            >
              {copy.footer.shipping}
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.legalLink}
              prefetch="intent"
              to="/copyright"
            >
              {copy.footer.copyright}
            </LocaleAwareLink>
          </nav>
        </Reveal>
      </PageContainer>
    </footer>
  );
}

function footerLabel(to: string, copy: UiCopy): string {
  switch (to) {
    case '/shop':
      return copy.footer.shop;
    case '/collections':
      return copy.footer.limited;
    case '/journal':
      return copy.footer.journal;
    case '/blog':
      return copy.footer.blog;
    case '/about':
      return copy.footer.about;
    case '/size-guide':
      return copy.footer.sizeGuide;
    case '/care':
      return copy.footer.care;
    case '/shipping-returns':
      return copy.footer.shippingReturns;
    case '/contact':
      return copy.footer.contact;
    case '/policies/privacy-policy':
      return copy.footer.privacy;
    case '/policies/terms-of-service':
      return copy.footer.terms;
    case '/policies/refund-policy':
      return copy.footer.refunds;
    case '/copyright':
      return copy.footer.copyright;
    default:
      return (
        SHOP_LINKS.find((link) => link.to === to)?.label ??
        SUPPORT_LINKS.find((link) => link.to === to)?.label ??
        to
      );
  }
}
