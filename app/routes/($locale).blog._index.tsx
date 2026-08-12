import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).blog._index';
import {getPaginationVariables} from '@shopify/hydrogen';
import heroBlog from '~/assets/mockups/lookbook-02.jpg';
import {JournalCard} from '~/components/content/JournalCard';
import {EmptyState} from '~/components/feedback/EmptyState';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import {BLOG_INDEX_QUERY} from '~/graphql/queries/blog';
import styles from '~/components/content/JournalIndexGrid.module.css';
import indexStyles from '~/components/content/JournalIndexPage.module.css';

export const meta: Route.MetaFunction = ({data}) => {
  return buildMetaTags({
    title: data?.blog?.seo?.title || data?.blog?.title || 'Blog',
    description:
      data?.blog?.seo?.description ||
      'Fashion trends, stories, and culture from Afterstate — notes for the wider fashion world.',
  });
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  const result = await storefront
    .query(BLOG_INDEX_QUERY, {
      variables: {...paginationVariables},
      cache: storefront.CacheShort(),
    })
    .catch(() => null);

  return {
    blog: result?.blog ?? null,
  };
}

export default function BlogIndex() {
  const {blog} = useLoaderData<typeof loader>();
  const articles = (blog?.articles?.nodes ?? []).map((article) => ({
    id: article.id,
    to: `/blog/${article.handle}`,
    title: article.title,
    eyebrow: article.publishedAt
      ? new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(article.publishedAt))
      : 'Blog',
    excerpt: article.excerpt ?? undefined,
    image: article.image,
  }));

  return (
    <div className="blog-index">
      <PageHero
        eyebrow="Afterstate"
        title="Blog"
        support="Fashion trends, stories, and culture — written for the wider fashion world."
        imageSrc={heroBlog}
        imageAlt="Editorial fashion imagery for the Afterstate blog"
      />

      <Reveal>
        <section
          className={indexStyles.intro}
          aria-labelledby="blog-intro-title"
        >
          <p className={indexStyles.introEyebrow}>Fashion world</p>
          <h2 id="blog-intro-title" className={indexStyles.introTitle}>
            Trends, stories, and the culture around clothes
          </h2>
          <div className={indexStyles.introBody}>
            <p>
              The blog is Afterstate&apos;s window onto the broader fashion
              conversation — silhouettes moving through cities, seasonal
              shifts, craft stories, and the people shaping how we dress.
            </p>
            <p>
              Journal stays close to the brand. Here we look outward: useful
              reading for anyone who cares about fashion, not only Afterstate.
            </p>
          </div>
        </section>
      </Reveal>

      <EditorialStage>
        <div className={stageStyles.section}>
          <header className={stageStyles.header}>
            <p className={stageStyles.eyebrow}>Latest</p>
            <h2 className={stageStyles.title}>From the blog</h2>
            <p className={stageStyles.lede}>
              Fashion trends, field notes, and stories from the wider world of
              style.
            </p>
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
            <EmptyState
              title="First posts coming soon"
              message="We are preparing fashion trends, stories, and culture pieces for this space. Check back shortly — or read the Journal in the meantime."
              action={
                <LocaleAwareLink prefetch="intent" to="/journal">
                  Read the Journal
                </LocaleAwareLink>
              }
            />
          )}
        </div>
      </EditorialStage>
    </div>
  );
}
