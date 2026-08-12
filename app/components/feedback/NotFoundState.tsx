import heroNotFound from '~/assets/mockups/lookbook-02.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import quiet from '~/components/content/QuietPage.module.css';
import styles from './NotFoundState.module.css';

const WAYFINDING = [
  {label: 'Shop', hint: 'The collection', to: '/shop'},
  {label: 'Journal', hint: 'Notes & essays', to: '/journal'},
  {label: 'About', hint: 'The brand', to: '/about'},
  {label: 'Contact', hint: 'Write us', to: '/contact'},
] as const;

type NotFoundStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export function NotFoundState({
  title = 'Afterstate',
  message = 'This page does not exist — or it moved without leaving a note.',
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={[quiet.world, styles.root, className].filter(Boolean).join(' ')}
    >
      <PageHero
        align="center"
        eyebrow="404"
        title={title}
        support={message}
        imageSrc={heroNotFound}
        imageAlt="Afterstate lookbook — quiet silhouette"
        actions={
          <div className={styles.actions}>
            <LocaleAwareLink
              className={styles.primary}
              to="/"
              prefetch="intent"
            >
              Back home
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.secondary}
              to="/shop"
              prefetch="intent"
            >
              Browse the shop
            </LocaleAwareLink>
          </div>
        }
      />

      <Reveal delayMs={80}>
        <section className={quiet.panel} aria-label="Find your way">
          <div className={`${quiet.panelInner} ${quiet.alignCenter}`}>
            <header className={quiet.panelHeader}>
              <p className={quiet.eyebrow}>No rush</p>
              <h2 className={quiet.panelTitle}>Find your way</h2>
              <p className={styles.panelLede}>
                Start again from somewhere that still exists.
              </p>
            </header>
            <ul className={quiet.links}>
              {WAYFINDING.map((item) => (
                <li key={item.to} className={quiet.linkItem}>
                  <LocaleAwareLink
                    className={quiet.link}
                    prefetch="intent"
                    to={item.to}
                  >
                    <span className={quiet.linkLabel}>{item.label}</span>
                    <span className={quiet.linkHint}>{item.hint}</span>
                  </LocaleAwareLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
