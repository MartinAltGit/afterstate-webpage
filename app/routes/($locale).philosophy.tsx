import type {Route} from './+types/($locale).philosophy';
import heroPhilosophy from '~/assets/mockups/campaign-look.jpg';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Philosophy',
    description:
      'Calm, intentional clothing. Afterstate is about pace, permanence, and choosing less with care.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function PhilosophyPage() {
  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Philosophy"
        title="Enough"
        support="Enough quality, enough thought, enough time to live in what you wear."
        imageSrc={heroPhilosophy}
        imageAlt="Afterstate campaign look — no rush"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Meaning</p>
            <p className={styles.lede}>
              Afterstate is not about more. We design for calm intent — pieces
              that do not shout, and do not need replacing when the calendar
              turns.
            </p>
            <hr className={styles.rule} />
            <p className={styles.note}>
              No Rush is the practice: slow the drop, respect the material, and
              leave room for the garment to become yours.
            </p>
          </header>
        </div>
      </Reveal>
    </div>
  );
}
