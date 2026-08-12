import type {Route} from './+types/($locale).shipping-returns';
import heroShipping from '~/assets/mockups/hero-campaign-caps.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Shipping & returns',
    description:
      'Afterstate ships to the UK and Europe. Change-of-mind returns within 14 days — you cover return postage unless the item is faulty or wrong.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function ShippingReturnsPage() {
  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Orders"
        title="Shipping & returns"
        support="UK and Europe — tracking by email, 14-day returns with tags on."
        imageSrc={heroShipping}
        imageAlt="Afterstate caps — campaign still"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>What to expect</p>
            <p className={styles.lede}>
              We ship to the United Kingdom and Europe. Delivery windows, rates,
              and any duties appear at checkout before you pay.
            </p>
            <hr className={styles.rule} />
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping</h2>
            <p className={styles.note}>
              Orders usually dispatch within 1–3 UK business days. UK delivery
              is typically 2–5 business days after dispatch; EU delivery is
              typically 3–10. Once an order ships, you receive tracking by
              email when the carrier provides it.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Change-of-mind returns</h2>
            <p className={styles.note}>
              Unworn items with tags may be returned within{' '}
              <strong>14 days of delivery</strong>. Email{' '}
              <a className={styles.mailLink} href="mailto:info@upvision.uk">
                info@upvision.uk
              </a>{' '}
              with your order number to start a return.
            </p>
            <p className={styles.note}>
              <strong>You pay return shipping</strong> for change-of-mind
              returns. Use a tracked service — we are not responsible for
              parcels lost before they reach us. Original outbound shipping is
              not refunded on change-of-mind returns.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Faulty or wrong item</h2>
            <p className={styles.note}>
              If something arrives damaged, faulty, or incorrect, tell us within
              14 days with photos. We will arrange a replacement or refund and
              cover reasonable return postage.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Final sale</h2>
            <p className={styles.note}>
              Pieces marked Final Sale on the product page cannot be returned
              for change of mind. Your rights for faulty goods still apply.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Formal policies</h2>
            <p className={styles.note}>
              Full legal text lives under{' '}
              <LocaleAwareLink prefetch="intent" to="/policies">
                Policies
              </LocaleAwareLink>
              , including{' '}
              <LocaleAwareLink prefetch="intent" to="/policies/refund-policy">
                Refund
              </LocaleAwareLink>
              ,{' '}
              <LocaleAwareLink prefetch="intent" to="/policies/shipping-policy">
                Shipping
              </LocaleAwareLink>
              , and{' '}
              <LocaleAwareLink
                prefetch="intent"
                to="/policies/terms-of-service"
              >
                Terms
              </LocaleAwareLink>
              . Need help?{' '}
              <LocaleAwareLink prefetch="intent" to="/contact">
                Contact
              </LocaleAwareLink>
              .
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
