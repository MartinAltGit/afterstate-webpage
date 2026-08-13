import type {Route} from './+types/($locale).about';
import heroAbout from '~/assets/mockups/lookbook-01.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

const ABOUT_LINKS = [
  {label: 'Contact', hint: 'Write us', to: '/contact'},
  {label: 'Philosophy', hint: 'Why we make less', to: '/philosophy'},
  {label: 'Care', hint: 'Wear longer', to: '/care'},
  {label: 'Size guide', hint: 'Fit notes', to: '/size-guide'},
  {label: 'Shipping & returns', hint: 'Orders', to: '/shipping-returns'},
] as const;

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'About',
    description:
      'Afterstate makes fewer clothes, on purpose. A small clothing brand for a slower pace — short runs, clear intent, pieces meant to last.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function AboutPage() {
  return (
    <div className={styles.world}>
      <PageHero
        align="center"
        eyebrow="About"
        title="Afterstate"
        support="Clothes for the part of life that comes after the noise."
        imageSrc={heroAbout}
        imageAlt="Afterstate lookbook — quiet silhouette against soft light"
      />

      <Reveal>
        <div className={`${styles.root} ${styles.alignCenter}`}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>The brand</p>
            <p className={styles.lede}>
              Settled, useful, and quietly considered — fewer pieces with clearer
              intent, made to hold up beyond a single season.
            </p>
            <hr className={styles.rule} />
            <p className={styles.note}>
              Afterstate 001: No Rush is the first collection — a statement
              against forced pace, and an invitation to wear things longer.
            </p>
          </header>
        </div>
      </Reveal>

      <Reveal delayMs={100}>
        <section className={styles.panel} aria-label="Brand pages">
          <div className={styles.panelInner}>
            <header className={styles.panelHeader}>
              <p className={styles.eyebrow}>Also here</p>
              <h2 className={styles.panelTitle}>Contact &amp; details</h2>
            </header>
            <ul className={styles.links}>
              {ABOUT_LINKS.map((item) => (
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
          tagline: 'Life beyond the rush.',
          body: 'Fewer pieces. Clearer intent.',
        }}
      />
    </div>
  );
}
