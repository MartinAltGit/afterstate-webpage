import type {Route} from './+types/($locale).copyright';
import heroCopyright from '~/assets/mockups/lookbook-01.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

const SUPPORT_EMAIL = 'info@upvision.uk';
const YEAR = new Date().getFullYear();

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Copyright & intellectual property',
    description:
      'Afterstate owns its photography, lookbooks, designs, and brand marks. How to request permission and report misuse.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function CopyrightPage() {
  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Legal"
        title="Copyright"
        support="Our images, designs, and name are protected — ask before you reuse them."
        imageSrc={heroCopyright}
        imageAlt="Afterstate lookbook still"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Ownership</p>
            <p className={styles.lede}>
              © {YEAR} Afterstate. All rights reserved. Trading name of KKOSTOV
              LTD (14964341), London, United Kingdom.
            </p>
            <hr className={styles.rule} />
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What we protect</h2>
            <p className={styles.note}>
              Product photography, lookbook sequences, campaign films, website
              copy, logos, wordmarks, garment designs, and related brand assets
              are owned by Afterstate or used under licence. They are not free
              stock.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What you may not do</h2>
            <ul className={styles.bulletList}>
              <li>Copy, scrape, or download our media for commercial reuse</li>
              <li>Resell, white-label, or impersonate Afterstate products or pages</li>
              <li>Remove watermarks, credits, or alter images to hide origin</li>
              <li>Use our name or marks in ads, domains, or social handles without written permission</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Permission &amp; press</h2>
            <p className={styles.note}>
              Editorial or partnership use needs written approval. Email{' '}
              <a className={styles.mailLink} href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>{' '}
              with the assets you need and how you plan to use them.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Report misuse</h2>
            <p className={styles.note}>
              If you see stolen lookbook images, fake shops, or brand
              impersonation, send the URL and a short note to{' '}
              <a className={styles.mailLink} href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              . We take infringement and fraud seriously.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Related</h2>
            <p className={styles.note}>
              Purchase rules live in{' '}
              <LocaleAwareLink prefetch="intent" to="/policies/terms-of-service">
                Terms of Service
              </LocaleAwareLink>
              . Data practices are in our{' '}
              <LocaleAwareLink prefetch="intent" to="/policies/privacy-policy">
                Privacy Policy
              </LocaleAwareLink>
              . Shipping and returns:{' '}
              <LocaleAwareLink prefetch="intent" to="/shipping-returns">
                Shipping &amp; returns
              </LocaleAwareLink>
              .
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
