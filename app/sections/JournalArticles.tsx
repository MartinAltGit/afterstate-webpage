import {JournalCard} from '~/components/content/JournalCard';
import {Reveal} from '~/components/motion/Reveal';
import styles from './JournalArticles.module.css';
import type {JournalArticlesSection} from './types';

type JournalArticlesProps = {
  section: JournalArticlesSection;
};

/**
 * Journal teaser grid for homepage and editorial landings.
 */
export function JournalArticles({section}: JournalArticlesProps) {
  const articles = section.articles ?? [];

  return (
    <section
      className={styles.root}
      aria-labelledby={`journal-${section.id}-title`}
    >
      <Reveal as="header" className={styles.header}>
        <div>
          {section.eyebrow ? (
            <p className={styles.eyebrow}>{section.eyebrow}</p>
          ) : null}
          <h2 id={`journal-${section.id}-title`} className={styles.title}>
            {section.title ?? 'From the journal'}
          </h2>
        </div>
      </Reveal>
      {articles.length > 0 ? (
        <div className={styles.grid}>
          {articles.map((article, index) => (
            <Reveal key={article.id} delayMs={Math.min(index, 6) * 100}>
              <JournalCard
                to={article.to}
                title={article.title}
                eyebrow={article.eyebrow}
                excerpt={article.excerpt}
                image={article.image}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delayMs={40}>
          <p className={styles.empty}>
            New Afterstate journal pieces will land here.
          </p>
        </Reveal>
      )}
    </section>
  );
}
