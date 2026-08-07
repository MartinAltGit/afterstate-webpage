import {JournalCard} from '~/components/content/JournalCard';
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
      <header className={styles.header}>
        <div>
          {section.eyebrow ? (
            <p className={styles.eyebrow}>{section.eyebrow}</p>
          ) : null}
          <h2 id={`journal-${section.id}-title`} className={styles.title}>
            {section.title ?? 'From the journal'}
          </h2>
        </div>
      </header>
      {articles.length > 0 ? (
        <div className={styles.grid}>
          {articles.map((article) => (
            <JournalCard
              key={article.id}
              to={article.to}
              title={article.title}
              eyebrow={article.eyebrow}
              excerpt={article.excerpt}
              image={article.image}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          New Afterstate journal pieces will land here.
        </p>
      )}
    </section>
  );
}
