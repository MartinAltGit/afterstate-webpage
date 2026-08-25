import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).journal.essays';
import {getPaginationVariables} from '@shopify/hydrogen';
import heroJournal from '~/assets/mockups/campaign-look-alt.jpg';
import {JournalCard} from '~/components/content/JournalCard';
import {NewsletterForm} from '~/components/content/NewsletterForm';
import {QuoteBlock} from '~/components/content/QuoteBlock';
import {CustomerVoices} from '~/components/journal/CustomerVoices';
import {IconPrinciples} from '~/components/journal/IconPrinciples';
import type {JournalIconName} from '~/components/journal/JournalIcons';
import journalWorld from '~/components/journal/journalWorld.module.css';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {JOURNAL_INDEX_QUERY} from '~/graphql/queries/journal';
import {FALLBACK_JOURNAL_LIST} from '~/lib/journal/fallback';
import {getUiCopy, useUiCopy} from '~/lib/ui-copy';
import styles from '~/components/content/JournalIndexGrid.module.css';
import indexStyles from '~/components/content/JournalIndexPage.module.css';

export const meta: Route.MetaFunction = ({data, location}) => {
  const copy = getUiCopy(location.pathname);
  return buildMetaTags({
    title: data?.blog?.seo?.title || data?.blog?.title || copy.essays.metaTitle,
    description: data?.blog?.seo?.description || copy.essays.metaDescription,
  });
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  const result = await storefront
    .query(JOURNAL_INDEX_QUERY, {
      variables: {...paginationVariables},
      cache: storefront.CacheLong(),
    })
    .catch(() => null);

  return {
    blog: result?.blog ?? null,
  };
}

export default function JournalEssays() {
  const {blog} = useLoaderData<typeof loader>();
  const copy = useUiCopy();
  const liveArticles = blog?.articles?.nodes ?? [];
  const hasLiveArticles = liveArticles.length > 0;

  const articles = hasLiveArticles
    ? liveArticles.map((article) => ({
        id: article.id,
        to: `/journal/${article.handle}`,
        title: article.title,
        eyebrow: article.publishedAt
          ? new Intl.DateTimeFormat(copy.dateLocale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(article.publishedAt))
          : copy.essays.eyebrow,
        excerpt: article.excerpt ?? undefined,
        image: article.image,
      }))
    : FALLBACK_JOURNAL_LIST.map((article) => {
        const localized =
          copy.essays.articles[
            article.handle as keyof typeof copy.essays.articles
          ];
        return {
          id: article.handle,
          to: `/journal/${article.handle}`,
          title: localized?.title ?? article.title,
          eyebrow: localized?.eyebrow ?? article.eyebrow,
          excerpt: localized?.excerpt ?? article.excerpt,
          image: article.hero,
        };
      });

  return (
    <div className={`journal-index ${journalWorld.journalWorld}`}>
      <PageHero
        eyebrow={copy.essays.eyebrow}
        title={copy.essays.title}
        support={copy.essays.support}
        imageSrc={heroJournal}
        imageAlt={copy.essays.imageAlt}
      />

      <Reveal>
        <section
          className={indexStyles.intro}
          aria-labelledby="journal-intro-title"
        >
          <p className={indexStyles.introEyebrow}>{copy.essays.introEyebrow}</p>
          <h2 id="journal-intro-title" className={indexStyles.introTitle}>
            {copy.essays.introTitle}
          </h2>
          <div className={indexStyles.introBody}>
            <p>{copy.essays.introP1}</p>
            <p>{copy.essays.introP2}</p>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={40}>
        <QuoteBlock
          quote={copy.essays.quote}
          attribution={copy.essays.quoteAttr}
        />
      </Reveal>

      <EditorialStage>
        <div className={stageStyles.section}>
          <header className={stageStyles.header}>
            <p className={stageStyles.eyebrow}>{copy.essays.fromEyebrow}</p>
            <h2 className={stageStyles.title}>{copy.essays.fromTitle}</h2>
            <p className={stageStyles.lede}>{copy.essays.fromLede}</p>
          </header>

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
        </div>
      </EditorialStage>

      <Reveal delayMs={40}>
        <CustomerVoices />
      </Reveal>

      <Reveal delayMs={60}>
        <IconPrinciples
          eyebrow={copy.essays.standardsEyebrow}
          title={copy.essays.standardsTitle}
          principles={copy.essays.principles.map((item) => ({
            id: item.id,
            icon: item.id as JournalIconName,
            label: item.label,
            body: item.body,
          }))}
        />
      </Reveal>

      <Reveal delayMs={40}>
        <NewsletterForm
          eyebrow={copy.essays.newsletterEyebrow}
          title={copy.essays.newsletterTitle}
          description={copy.essays.newsletterDesc}
          submitLabel={copy.essays.join}
          source="journal"
        />
      </Reveal>

      <OpeningStatement
        section={{
          id: 'journal-closing',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: copy.essays.closingTagline,
          body: copy.essays.closingBody,
        }}
      />
    </div>
  );
}
