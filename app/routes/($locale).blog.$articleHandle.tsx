import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).blog.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {JournalCard} from '~/components/content/JournalCard';
import {LookAd} from '~/components/content/LookAd';
import {ReadingProgress} from '~/components/journal/ReadingProgress';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {ArticleJsonLd, buildMetaTags} from '~/components/seo';
import {
  BLOG_ARTICLE_QUERY,
  BLOG_INDEX_QUERY,
  LOOK_AD_PRODUCTS_QUERY,
} from '~/graphql/queries/blog';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useAbsoluteSeoUrl} from '~/lib/seo/useAbsoluteSeoUrl';
import styles from '~/components/content/BlogArticle.module.css';

export const meta: Route.MetaFunction = ({data}) => {
  const article = data?.article;
  return buildMetaTags({
    title: article?.seo?.title || article?.title || 'Blog',
    description:
      article?.seo?.description ||
      article?.excerpt ||
      'A fashion story from the Afterstate blog.',
    type: 'article',
    imageUrl: article?.image?.url,
    imageAlt: article?.image?.altText ?? article?.title,
  });
};

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {articleHandle} = params;

  if (!articleHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {storefront} = context;
  const [articleResult, indexResult, lookResult] = await Promise.all([
    storefront
      .query(BLOG_ARTICLE_QUERY, {
        variables: {articleHandle},
        cache: storefront.CacheShort(),
      })
      .catch(() => null),
    storefront
      .query(BLOG_INDEX_QUERY, {
        variables: {first: 4},
        cache: storefront.CacheShort(),
      })
      .catch(() => null),
    storefront
      .query(LOOK_AD_PRODUCTS_QUERY, {
        cache: storefront.CacheShort(),
      })
      .catch(() => null),
  ]);

  const article = articleResult?.blog?.articleByHandle;

  if (!article) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {
    handle: articleHandle,
    data: article,
  });

  const related = (indexResult?.blog?.articles?.nodes ?? [])
    .filter((node) => node.handle !== article.handle)
    .slice(0, 3);

  const lookProducts = lookResult?.products?.nodes ?? [];

  return {article, related, lookProducts};
}

function readingMinutesFromHtml(html: string) {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}

export default function BlogArticle() {
  const {article, related, lookProducts} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author, publishedAt, excerpt, tags} =
    article;
  const url = useAbsoluteSeoUrl(`/blog/${article.handle}`);
  const minutes = readingMinutesFromHtml(contentHtml);

  const publishedDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(publishedAt));

  return (
    <>
      <ArticleJsonLd
        headline={title}
        description={excerpt ?? undefined}
        url={url}
        image={image?.url}
        datePublished={publishedAt}
        authorName={author?.name ?? 'Afterstate'}
      />

      <article className={styles.article}>
        <ReadingProgress />

        <header
          className={[styles.hero, image ? null : styles.heroBare]
            .filter(Boolean)
            .join(' ')}
        >
          {image ? (
            <div className={styles.heroMedia}>
              <Image
                data={image}
                className={styles.heroImage}
                sizes="100vw"
                loading="eager"
              />
              <div className={styles.heroVeil} />
              <div className={styles.heroGrain} />
            </div>
          ) : null}

          <div className={styles.heroTop}>
            <LocaleAwareLink
              prefetch="intent"
              to="/blog"
              className={styles.back}
            >
              <span aria-hidden="true">←</span> Blog
            </LocaleAwareLink>
          </div>

          <div className={styles.heroInner}>
            <p className={styles.meta}>
              <time dateTime={publishedAt}>{publishedDate}</time>
              {' · '}
              <span>{minutes} min read</span>
            </p>
            <h1 className={styles.title}>{title}</h1>
          </div>
        </header>

        <div className={styles.stage}>
          <div className={styles.pair}>
            <div className={styles.column}>
              {tags?.length ? (
                <ul className={styles.tags} aria-label="Tags">
                  {tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div
                className={styles.body}
                dangerouslySetInnerHTML={{__html: contentHtml}}
              />

              <footer className={styles.footer}>
                <LocaleAwareLink
                  prefetch="intent"
                  to="/blog"
                  className={styles.back}
                >
                  <span aria-hidden="true">←</span> More from the blog
                </LocaleAwareLink>
              </footer>
            </div>

            <LookAd className={styles.rail} products={lookProducts} />
          </div>
        </div>

        {related.length > 0 ? (
          <aside className={styles.more} aria-labelledby="more-from-blog">
            <div className={styles.moreInner}>
              <div>
                <p className={styles.moreEyebrow}>Continue</p>
                <h2 id="more-from-blog" className={styles.moreTitle}>
                  More from the blog
                </h2>
              </div>
              <div className={styles.moreGrid}>
                {related.map((node) => (
                  <JournalCard
                    key={node.id}
                    to={`/blog/${node.handle}`}
                    title={node.title}
                    eyebrow={
                      node.publishedAt
                        ? new Intl.DateTimeFormat('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }).format(new Date(node.publishedAt))
                        : 'Blog'
                    }
                    excerpt={node.excerpt ?? undefined}
                    image={node.image}
                  />
                ))}
              </div>
            </div>
          </aside>
        ) : null}
      </article>
    </>
  );
}
