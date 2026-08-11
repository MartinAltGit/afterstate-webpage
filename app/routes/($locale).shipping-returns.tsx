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
      'How Afterstate ships, how long it takes, and how returns work when something is not right.',
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
        support="Clear windows at checkout — tracking by email, returns with tags attached."
        imageSrc={heroShipping}
        imageAlt="Afterstate caps — campaign still"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>What to expect</p>
            <p className={styles.lede}>
              We ship to the markets we sell in. Delivery windows and duties
              depend on your address and appear at checkout before you pay.
            </p>
            <hr className={styles.rule} />
            <p className={styles.note}>
              Once an order ships, you receive tracking by email. Unworn items
              with tags may be returned within the window on your order
              confirmation. Final sale pieces are marked on the product page.
            </p>
            <p className={styles.note}>
              Formal policy text lives under{' '}
              <LocaleAwareLink prefetch="intent" to="/policies">
                Policies
              </LocaleAwareLink>
              . Need help?{' '}
              <LocaleAwareLink prefetch="intent" to="/contact">
                Contact
              </LocaleAwareLink>
              .
            </p>
          </header>
        </div>
      </Reveal>
    </div>
  );
}
