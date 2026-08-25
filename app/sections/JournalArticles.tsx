import {JournalCard} from '~/components/content/JournalCard';
import {Reveal} from '~/components/motion/Reveal';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './JournalArticles.module.css';
import type {JournalArticlesSection} from './types';

const ESSAY_HANDLES = [
  'no-rush',
  'life-beyond-the-rush',
  'the-weight-of-quiet-clothing',
] as const;

function essayHandleFromTo(to: string) {
  const match = to.match(/\/journal\/([^/?#]+)/);
  const handle = match?.[1];
  return ESSAY_HANDLES.find((item) => item === handle);
}

type JournalArticlesProps = {
  section: JournalArticlesSection;
};

/**
 * Journal teaser grid for homepage and editorial landings.
 */
export function JournalArticles({section}: JournalArticlesProps) {
  const copy = useUiCopy();
  const articles = section.articles ?? [];

  return (
    <section
      className={styles.root}
      aria-labelledby={`journal-${section.id}-title`}
    >
      <Reveal as="header" className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {section.eyebrow || copy.landing.journalEyebrow}
          </p>
          <h2 id={`journal-${section.id}-title`} className={styles.title}>
            {copy.landing.journalTitle}
          </h2>
        </div>
      </Reveal>
      {articles.length > 0 ? (
        <div className={styles.grid}>
          {articles.map((article, index) => {
            const handle = essayHandleFromTo(article.to);
            const localized = handle ? copy.essays.articles[handle] : null;
            return (
              <Reveal key={article.id} delayMs={Math.min(index, 6) * 100}>
                <JournalCard
                  to={article.to}
                  title={localized?.title ?? article.title}
                  eyebrow={localized?.eyebrow ?? article.eyebrow}
                  excerpt={localized?.excerpt ?? article.excerpt}
                  image={article.image}
                />
              </Reveal>
            );
          })}
        </div>
      ) : (
        <Reveal delayMs={40}>
          <p className={styles.empty}>{copy.landing.journalEmpty}</p>
        </Reveal>
      )}
    </section>
  );
}
