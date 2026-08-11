import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).journal._index';
import {getPaginationVariables} from '@shopify/hydrogen';
import heroJournal from '~/assets/mockups/campaign-look-alt.jpg';
import {JournalCard} from '~/components/content/JournalCard';
import {NewsletterForm} from '~/components/content/NewsletterForm';
import {QuoteBlock} from '~/components/content/QuoteBlock';
import {CustomerVoices} from '~/components/journal/CustomerVoices';
import {IconPrinciples} from '~/components/journal/IconPrinciples';
import journalWorld from '~/components/journal/journalWorld.module.css';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {JOURNAL_INDEX_QUERY} from '~/graphql/queries/journal';
import {FALLBACK_JOURNAL_LIST} from '~/lib/journal/fallback';
import styles from '~/components/content/JournalIndexGrid.module.css';
import indexStyles from '~/components/content/JournalIndexPage.module.css';

export const meta: Route.MetaFunction = ({data}) => {
  return buildMetaTags({
    title: data?.blog?.seo?.title || data?.blog?.title || 'Journal',
    description:
      data?.blog?.seo?.description ||
      'Notes from Afterstate — the brand story, quality standards, and the quieter thinking behind the clothes.',
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

export default function JournalIndex() {
  const {blog} = useLoaderData<typeof loader>();
  const liveArticles = blog?.articles?.nodes ?? [];
  const hasLiveArticles = liveArticles.length > 0;

  const articles = hasLiveArticles
    ? liveArticles.map((article) => ({
        id: article.id,
        to: `/journal/${article.handle}`,
        title: article.title,
        eyebrow: article.publishedAt
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(article.publishedAt))
          : 'Journal',
        excerpt: article.excerpt ?? undefined,
        image: article.image,
      }))
    : FALLBACK_JOURNAL_LIST.map((article) => ({
        id: article.handle,
        to: `/journal/${article.handle}`,
        title: article.title,
        eyebrow: article.eyebrow,
        excerpt: article.excerpt,
        image: article.hero,
      }));

  return (
    <div className={`journal-index ${journalWorld.journalWorld}`}>
      <PageHero
        eyebrow="Afterstate"
        title="Journal"
        support="Brand story, quality standards, and the quieter thinking behind the clothes."
        imageSrc={heroJournal}
        imageAlt="Model in Afterstate 001 No Rush campaign hoodie at dusk"
      />

      <Reveal>
        <section
          className={indexStyles.intro}
          aria-labelledby="journal-intro-title"
        >
          <p className={indexStyles.introEyebrow}>Studio notes</p>
          <h2 id="journal-intro-title" className={indexStyles.introTitle}>
            After the noise, the clothes still have to mean something
          </h2>
          <div className={indexStyles.introBody}>
            <p>
              Afterstate began as a refusal: fewer drops, denser fabric, and a
              pace that lets a garment become yours. The journal is where that
              fiction lives in full — origin nights, material decisions, and the
              practice of dressing without urgency.
            </p>
            <p>
              Read it like a lookbook with sentences. Nothing here is trend
              forecasting. Everything here is intent.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={40}>
        <QuoteBlock
          quote="Life beyond the rush is not a slogan. It is a wardrobe that stops asking for more."
          attribution="Afterstate Journal"
        />
      </Reveal>

      <EditorialStage>
        <div className={stageStyles.section}>
          <header className={stageStyles.header}>
            <p className={stageStyles.eyebrow}>Essays</p>
            <h2 className={stageStyles.title}>From the journal</h2>
            <p className={stageStyles.lede}>
              Three starting chapters — origin, pace, and the weight of quiet
              cloth.
            </p>
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
          eyebrow="Standards"
          title="What we stand behind"
          principles={[
            {
              id: 'limited',
              icon: 'limited',
              label: 'Limited editions only',
              body: 'Short runs. No restocks. When a piece sells through, its chapter closes — scarcity as honesty, not hype.',
            },
            {
              id: 'fabric',
              icon: 'fabric',
              label: 'Fabric you can feel',
              body: 'Heavy cotton and brushed fleece chosen for hand-feel and years of wear, not for a single campaign frame.',
            },
            {
              id: 'stitch',
              icon: 'stitch',
              label: 'Construction for the long wear',
              body: 'Seams, finishes, and hardware tuned so the garment softens into your life instead of falling apart out of it.',
            },
            {
              id: 'mark',
              icon: 'mark',
              label: 'A quieter mark',
              body: 'The AS sits small. Colour stays grounded. The silhouette does the speaking.',
            },
          ]}
        />
      </Reveal>

      <Reveal delayMs={40}>
        <NewsletterForm
          eyebrow="Stay close"
          title="Journal + drop notes"
          description="New essays, limited runs, and quiet updates — never a rush of noise."
          submitLabel="Join"
        />
      </Reveal>

      <OpeningStatement
        section={{
          id: 'journal-closing',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: 'Life beyond the rush.',
          body: 'Every piece is limited edition. Short runs. No restocks.',
        }}
      />
    </div>
  );
}
