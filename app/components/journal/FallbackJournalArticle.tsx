import {Link} from 'react-router';
import {
  EditorialImage,
  EditorialText,
  ManifestoBlock,
  QuoteBlock,
  SplitMediaText,
} from '~/components/content';
import {IconPrinciples} from '~/components/journal/IconPrinciples';
import {ReadingProgress} from '~/components/journal/ReadingProgress';
import journalWorld from '~/components/journal/journalWorld.module.css';
import {Reveal} from '~/components/motion/Reveal';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {getEssayCopy, type EssayStoryCopy} from '~/lib/journal-essay-copy';
import {
  getFallbackJournalArticle,
  JOURNAL_IMAGES,
  type FallbackJournalArticle,
  type FallbackJournalImage,
} from '~/lib/journal/fallback';
import {useUiCopy, useUiLang} from '~/lib/ui-copy';
import styles from './FallbackJournalArticle.module.css';

const ESSAY_HANDLES = [
  'no-rush',
  'life-beyond-the-rush',
  'the-weight-of-quiet-clothing',
] as const;

type FallbackJournalArticleViewProps = {
  article: FallbackJournalArticle;
};

function RelatedReading({handles}: {handles: string[]}) {
  const copy = useUiCopy();

  return (
    <aside className={styles.related} aria-labelledby="related-reading-title">
      <p className={styles.relatedEyebrow}>{copy.journalChrome.continue}</p>
      <h2 id="related-reading-title" className={styles.relatedTitle}>
        {copy.journalChrome.moreFrom}
      </h2>
      <ul className={styles.relatedList}>
        {handles.map((handle) => {
          const related = getFallbackJournalArticle(handle);
          if (!related) return null;
          const localized =
            ESSAY_HANDLES.find((item) => item === handle) != null
              ? copy.essays.articles[handle as (typeof ESSAY_HANDLES)[number]]
              : null;
          return (
            <li key={handle}>
              <Link to={`/journal/${handle}`} prefetch="intent">
                <span className={styles.relatedLabel}>
                  {localized?.eyebrow ?? related.eyebrow}
                </span>
                <span className={styles.relatedName}>
                  {localized?.title ?? related.title}
                </span>
                <span className={styles.relatedCta}>
                  {copy.journalChrome.read}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function StoryFromCopy({
  story,
  manifestoLabel,
  images,
}: {
  story: EssayStoryCopy;
  manifestoLabel: string;
  images: {
    chapter1: FallbackJournalImage;
    mid: FallbackJournalImage;
    chapter2: FallbackJournalImage;
    chapter1Position: 'left' | 'right';
    chapter2Position: 'left' | 'right';
  };
}) {
  return (
    <>
      <Reveal>
        <EditorialText eyebrow={story.open.eyebrow} title={story.open.title}>
          <p>{story.open.p1}</p>
          <p>{story.open.p2}</p>
          {story.open.p3 ? <p>{story.open.p3}</p> : null}
        </EditorialText>
      </Reveal>

      <Reveal delayMs={60}>
        <QuoteBlock
          quote={story.quote.quote}
          attribution={story.quote.attribution}
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow={story.chapter1.eyebrow}
          title={story.chapter1.title}
          image={images.chapter1}
          mediaPosition={images.chapter1Position}
        >
          <p>{story.chapter1.p1}</p>
          <p>{story.chapter1.p2}</p>
        </SplitMediaText>
      </Reveal>

      <Reveal delayMs={80}>
        <ManifestoBlock label={manifestoLabel}>
          <p>{story.manifesto.p1}</p>
          <p>{story.manifesto.p2}</p>
        </ManifestoBlock>
      </Reveal>

      <Reveal delayMs={60}>
        <EditorialImage
          image={images.mid}
          caption={story.imageCaption}
          fullBleed
        />
      </Reveal>

      <Reveal delayMs={80}>
        <IconPrinciples
          eyebrow={story.standards.eyebrow}
          title={story.standards.title}
          principles={story.standards.principles}
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow={story.chapter2.eyebrow}
          title={story.chapter2.title}
          image={images.chapter2}
          mediaPosition={images.chapter2Position}
        >
          <p>{story.chapter2.p1}</p>
          <p>{story.chapter2.p2}</p>
        </SplitMediaText>
      </Reveal>

      {story.extraCaption ? (
        <Reveal delayMs={60}>
          <EditorialImage
            image={images.mid}
            caption={story.extraCaption}
            fullBleed
          />
        </Reveal>
      ) : null}

      {story.closing ? (
        <Reveal delayMs={80}>
          <ManifestoBlock label={story.closing.label}>
            <p>{story.closing.p1}</p>
            {story.closing.p2 ? <p>{story.closing.p2}</p> : null}
          </ManifestoBlock>
        </Reveal>
      ) : null}
    </>
  );
}

function ArticleBody({handle}: {handle: string}) {
  const essays = getEssayCopy(useUiLang());

  if (handle === 'no-rush') {
    return (
      <StoryFromCopy
        story={essays.noRush}
        manifestoLabel="No Rush"
        images={{
          chapter1: JOURNAL_IMAGES.lookbook02,
          mid: JOURNAL_IMAGES.heroHoodies,
          chapter2: JOURNAL_IMAGES.lookbook03,
          chapter1Position: 'left',
          chapter2Position: 'right',
        }}
      />
    );
  }

  if (handle === 'life-beyond-the-rush') {
    return (
      <StoryFromCopy
        story={essays.lifeBeyond}
        manifestoLabel="Afterstate"
        images={{
          chapter1: JOURNAL_IMAGES.campaignLook,
          mid: JOURNAL_IMAGES.lookbook02,
          chapter2: JOURNAL_IMAGES.lookbook03,
          chapter1Position: 'right',
          chapter2Position: 'left',
        }}
      />
    );
  }

  if (handle === 'the-weight-of-quiet-clothing') {
    return (
      <StoryFromCopy
        story={essays.quietCloth}
        manifestoLabel="Afterstate"
        images={{
          chapter1: JOURNAL_IMAGES.lookbook01,
          mid: JOURNAL_IMAGES.campaignLookAlt,
          chapter2: JOURNAL_IMAGES.lookbook03,
          chapter1Position: 'left',
          chapter2Position: 'right',
        }}
      />
    );
  }

  return null;
}

/**
 * Multi-section editorial layout for local journal essays
 * (used when Shopify blog content is not yet connected).
 */
export function FallbackJournalArticleView({
  article,
}: FallbackJournalArticleViewProps) {
  const copy = useUiCopy();
  const handle = ESSAY_HANDLES.find((item) => item === article.handle);
  const localized = handle ? copy.essays.articles[handle] : null;
  const publishedDate = new Intl.DateTimeFormat(copy.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className={[styles.root, journalWorld.journalWorld].join(' ')}>
      <ReadingProgress />

      <header className={styles.hero}>
        <div className={styles.heroMedia} aria-hidden="true">
          <img
            className={styles.heroImage}
            src={article.hero.url}
            alt=""
            width={article.hero.width}
            height={article.hero.height}
            decoding="async"
            fetchPriority="high"
          />
          <div className={styles.heroVeil} />
          <div className={styles.heroGrain} />
        </div>
        <div className={styles.heroInner}>
          <p className={styles.meta}>
            <span>{localized?.eyebrow ?? article.eyebrow}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={article.publishedAt}>{publishedDate}</time>
            <span aria-hidden="true"> · </span>
            <span>{article.authorName}</span>
          </p>
          <h1 className={styles.title}>{localized?.title ?? article.title}</h1>
          <p className={styles.excerpt}>
            {localized?.excerpt ?? article.excerpt}
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <ArticleBody handle={article.handle} />
        <RelatedReading handles={article.relatedHandles} />
      </div>

      <OpeningStatement
        section={{
          id: 'journal-article-close',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: copy.essays.closingTagline,
          body: copy.essays.closingBody,
        }}
      />
    </article>
  );
}
