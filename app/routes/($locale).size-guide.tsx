import type {Route} from './+types/($locale).size-guide';
import heroSize from '~/assets/mockups/hero-campaign-hoodies.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Size guide',
    description:
      'How Afterstate garments are intended to fit — measured, considered, and easy to live in. Use this before you order.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function SizeGuidePage() {
  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Fit"
        title="Size guide"
        support="Cut for ease without bulk — measured, considered, easy to live in."
        imageSrc={heroSize}
        imageAlt="Afterstate hoodies — fit and drape"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>How to choose</p>
            <p className={styles.lede}>
              For the intended drape, take your usual size. For a closer fit,
              consider sizing down.
            </p>
            <hr className={styles.rule} />
            <p className={styles.note}>
              Measurements and model notes live on each product page. Between
              sizes? Choose the larger for movement and layering, or{' '}
              <LocaleAwareLink prefetch="intent" to="/contact">
                write us
              </LocaleAwareLink>
              .
            </p>
          </header>
        </div>
      </Reveal>
    </div>
  );
}
