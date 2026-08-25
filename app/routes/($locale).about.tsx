import type {Route} from './+types/($locale).about';
import heroAbout from '~/assets/mockups/lookbook-01.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {buildMetaTags} from '~/components/seo';
import {getUiCopy, useUiCopy} from '~/lib/ui-copy';
import styles from '~/components/content/QuietPage.module.css';

export const meta: Route.MetaFunction = ({location}) => {
  const copy = getUiCopy(location.pathname);
  return buildMetaTags({
    title: copy.about.metaTitle,
    description: copy.about.metaDescription,
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function AboutPage() {
  const copy = useUiCopy();

  return (
    <div className={styles.world}>
      <PageHero
        align="center"
        eyebrow={copy.about.eyebrow}
        title={copy.about.title}
        support={copy.about.support}
        imageSrc={heroAbout}
        imageAlt={copy.about.imageAlt}
      />

      <Reveal>
        <div className={`${styles.root} ${styles.alignCenter}`}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>{copy.about.brandEyebrow}</p>
            <p className={styles.lede}>{copy.about.lede}</p>
            <hr className={styles.rule} />
            <p className={styles.note}>{copy.about.note}</p>
          </header>
        </div>
      </Reveal>

      <Reveal delayMs={100}>
        <section className={styles.panel} aria-label={copy.about.detailsAria}>
          <div className={styles.panelInner}>
            <header className={styles.panelHeader}>
              <p className={styles.eyebrow}>{copy.about.alsoHere}</p>
              <h2 className={styles.panelTitle}>{copy.about.detailsTitle}</h2>
            </header>
            <ul className={styles.links}>
              {copy.about.links.map((item) => (
                <li key={item.to} className={styles.linkItem}>
                  <LocaleAwareLink
                    className={styles.link}
                    prefetch="intent"
                    to={item.to}
                  >
                    <span className={styles.linkLabel}>{item.label}</span>
                    <span className={styles.linkHint}>{item.hint}</span>
                  </LocaleAwareLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      <OpeningStatement
        section={{
          id: 'about-closing',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: copy.about.closingTagline,
          body: copy.about.closingBody,
        }}
      />
    </div>
  );
}
