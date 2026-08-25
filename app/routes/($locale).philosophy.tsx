import type {Route} from './+types/($locale).philosophy';
import heroPhilosophy from '~/assets/mockups/campaign-look.jpg';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import {getUiCopy, useUiCopy} from '~/lib/ui-copy';
import styles from '~/components/content/QuietPage.module.css';

export const meta: Route.MetaFunction = ({location}) => {
  const copy = getUiCopy(location.pathname);
  return buildMetaTags({
    title: copy.philosophy.metaTitle,
    description: copy.philosophy.metaDescription,
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function PhilosophyPage() {
  const copy = useUiCopy();

  return (
    <div className={styles.world}>
      <PageHero
        eyebrow={copy.philosophy.eyebrow}
        title={copy.philosophy.title}
        support={copy.philosophy.support}
        imageSrc={heroPhilosophy}
        imageAlt={copy.philosophy.imageAlt}
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>{copy.philosophy.meaningEyebrow}</p>
            <p className={styles.lede}>{copy.philosophy.lede}</p>
            <hr className={styles.rule} />
            <p className={styles.note}>{copy.philosophy.note}</p>
          </header>
        </div>
      </Reveal>
    </div>
  );
}
