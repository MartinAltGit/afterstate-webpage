import type {Route} from './+types/($locale).care';
import heroCare from '~/assets/mockups/lookbook-02.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Care',
    description:
      'How to care for Afterstate garments so they last — wash less, mend when needed, wear longer.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function CarePage() {
  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Longevity"
        title="Care"
        support="Wash less. Mend when needed. Wear longer."
        imageSrc={heroCare}
        imageAlt="Afterstate garment detail"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Practice</p>
            <p className={styles.lede}>
              Clothes last when they are washed with restraint. Air out between
              wears, spot-clean when you can, and follow the care label on each
              piece.
            </p>
            <hr className={styles.rule} />
            <p className={styles.note}>
              Prefer cool water, gentle cycles, and low heat — or hang dry. Avoid
              harsh detergents and unnecessary softener. Small repairs keep
              garments in rotation.
            </p>
            <p className={styles.note}>
              Questions about a fabric?{' '}
              <LocaleAwareLink prefetch="intent" to="/contact">
                Contact
              </LocaleAwareLink>
            </p>
          </header>
        </div>
      </Reveal>
    </div>
  );
}
