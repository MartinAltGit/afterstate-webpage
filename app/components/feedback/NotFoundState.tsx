import heroNotFound from '~/assets/mockups/lookbook-02.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {useUiCopy} from '~/lib/ui-copy';
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
  message,
  className,
}: NotFoundStateProps) {
  const copy = useUiCopy();
  const resolvedMessage = message ?? copy.notFound.message;
  return (
    <div
      className={[quiet.world, styles.root, className].filter(Boolean).join(' ')}
    >
      <PageHero
        align="center"
        eyebrow="404"
        title={title}
        support={resolvedMessage}
        imageSrc={heroNotFound}
        imageAlt="Afterstate lookbook — quiet silhouette"
        actions={
          <div className={styles.actions}>
            <LocaleAwareLink
              className={styles.primary}
              to="/"
              prefetch="intent"
            >
              {copy.notFound.home}
            </LocaleAwareLink>
            <LocaleAwareLink
              className={styles.secondary}
              to="/shop"
              prefetch="intent"
            >
              {copy.notFound.shop}
            </LocaleAwareLink>
          </div>
        }
      />

      <Reveal delayMs={80}>
        <section className={quiet.panel} aria-label={copy.notFound.wayfinding}>
          <div className={`${quiet.panelInner} ${quiet.alignCenter}`}>
            <header className={quiet.panelHeader}>
              <p className={quiet.eyebrow}>{copy.notFound.restart}</p>
              <h2 className={quiet.panelTitle}>{copy.notFound.wayfinding}</h2>
              <p className={styles.panelLede}>{copy.notFound.lede}</p>
            </header>
            <ul className={quiet.links}>
              {WAYFINDING.map((item) => (
                <li key={item.to} className={quiet.linkItem}>
                  <LocaleAwareLink
                    className={quiet.link}
                    prefetch="intent"
                    to={item.to}
                  >
                    <span className={quiet.linkLabel}>
                      {item.to === '/shop'
                        ? copy.nav.shop
                        : item.to === '/journal'
                          ? copy.nav.journal
                          : item.to === '/about'
                            ? copy.footer.about
                            : copy.footer.contact}
                    </span>
                    <span className={quiet.linkHint}>
                      {item.to === '/shop'
                        ? copy.notFound.shopHint
                        : item.to === '/journal'
                          ? copy.notFound.journalHint
                          : item.to === '/about'
                            ? copy.notFound.aboutHint
                            : copy.notFound.contactHint}
                    </span>
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
