import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).blog.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {ArticleShare} from '~/components/content/ArticleShare';
import {JournalCard} from '~/components/content/JournalCard';
import {LookAd} from '~/components/content/LookAd';
import {ReadingProgress} from '~/components/journal/ReadingProgress';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FaqJsonLd,
  buildMetaTags,
} from '~/components/seo';
import {
  BLOG_ARTICLE_QUERY,
  BLOG_INDEX_QUERY,
  LOOK_AD_PRODUCTS_QUERY,
} from '~/graphql/queries/blog';
import {
  displayArticleTitle,
  extractFaq,
  hasBlogClass,
  prepareArticleHtml,
  readingMinutesFromHtml,
  tocHeadings,
  type ArticleHeading,
} from '~/lib/blog/articleHtml';
import {
  BLOG_CLUSTERS,
  clusterFromTags,
  clusterLabel,
  visibleBlogTags,
} from '~/lib/blog/clusters';
import {CAMPAIGN_PATH, SHOP_PATH} from '~/lib/content-paths';
import {pickRelatedArticles} from '~/lib/blog/related';
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
        variables: {first: 24},
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

  const prepared = prepareArticleHtml(article.contentHtml);
  const faq = extractFaq(prepared.html);
  const toc = tocHeadings(prepared.headings);
  const feed = indexResult?.blog?.articles?.nodes ?? [];
  const relatedPick = pickRelatedArticles(article.handle, article.tags, feed);
  const cluster = clusterFromTags(article.tags);
  const index = feed.findIndex((node) => node.handle === article.handle);
  const hubHandle = cluster ? BLOG_CLUSTERS[cluster].hubHandle : null;
  const hubArticle =
    hubHandle && hubHandle !== article.handle
      ? (feed.find((node) => node.handle === hubHandle) ?? null)
      : null;

  return {
    article: {
      ...article,
      contentHtml: prepared.html,
    },
    related: relatedPick.items,
    relatedFromCluster: relatedPick.fromCluster,
    clusterLabel: clusterLabel(cluster),
    hubArticle,
    toc,
    faq,
    hasQuickAnswer: hasBlogClass(prepared.html, 'blog-answer'),
    newer: index > 0 ? feed[index - 1] : null,
    older: index >= 0 ? (feed[index + 1] ?? null) : null,
    lookProducts: lookResult?.products?.nodes ?? [],
  };
}

function GuideToc({
  headings,
  className,
}: {
  headings: ArticleHeading[];
  className?: string;
}) {
  if (!headings.length) return null;

  return (
    <nav
      className={[styles.toc, className].filter(Boolean).join(' ')}
      aria-label="On this page"
    >
      <p className={styles.kicker}>On this page</p>
      <ol className={styles.tocList}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function BlogArticle() {
  const {
    article,
    related,
    relatedFromCluster,
    clusterLabel: seriesLabel,
    hubArticle,
    toc,
    faq,
    hasQuickAnswer,
    newer,
    older,
    lookProducts,
  } = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author, publishedAt, excerpt, tags} =
    article;
  const headline = displayArticleTitle(title);
  const url = useAbsoluteSeoUrl(`/blog/${article.handle}`);
  const blogUrl = useAbsoluteSeoUrl('/blog');
  const homeUrl = useAbsoluteSeoUrl('/');
  const minutes = readingMinutesFromHtml(contentHtml);
  const displayTags = visibleBlogTags(tags);
  const authorName = author?.name ?? 'Afterstate';
  const category = seriesLabel || displayTags[0] || 'Guide';

  const publishedDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(publishedAt));

  return (
    <>
      <ArticleJsonLd
        headline={headline}
        description={excerpt ?? undefined}
        url={url}
        image={image?.url}
        datePublished={publishedAt}
        authorName={authorName}
      />
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', url: homeUrl},
          {name: 'Blog', url: blogUrl},
          {name: headline, url},
        ]}
      />
      <FaqJsonLd items={faq} />

      <article className={styles.article}>
        <ReadingProgress />

        <div className={styles.stage}>
          <div className={styles.pair}>
            <div className={styles.column}>
              <nav aria-label="Breadcrumb">
                <ol className={styles.crumbs}>
                  <li>
                    <LocaleAwareLink prefetch="intent" to="/">
                      Home
                    </LocaleAwareLink>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <LocaleAwareLink prefetch="intent" to="/blog">
                      Blog
                    </LocaleAwareLink>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className={styles.crumbsCurrent}>{category}</li>
                </ol>
              </nav>

              <header className={styles.header}>
                <p className={styles.category}>{category}</p>
                <h1 className={styles.title}>{headline}</h1>
                <p className={styles.byline}>
                  <strong>{authorName}</strong>
                  <time dateTime={publishedAt}>{publishedDate}</time>
                  <span>{minutes} min read</span>
                </p>
              </header>

              {image ? (
                <figure className={styles.cover}>
                  <Image
                    data={image}
                    className={styles.coverImage}
                    sizes="(min-width: 64em) 46rem, 100vw"
                    loading="eager"
                  />
                  {image.altText ? (
                    <figcaption className={styles.coverCaption}>
                      {image.altText}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              {!hasQuickAnswer && excerpt ? (
                <aside className={styles.lead}>
                  <p className={styles.kicker}>In short</p>
                  <p>{excerpt}</p>
                </aside>
              ) : null}

              {displayTags.length ? (
                <ul className={styles.tags} aria-label="Tags">
                  {displayTags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              <GuideToc headings={toc} className={styles.tocInline} />

              <div className={styles.actions}>
                <LocaleAwareLink
                  prefetch="intent"
                  to={CAMPAIGN_PATH}
                  className={styles.action}
                >
                  Shop Afterstate 001
                </LocaleAwareLink>
                <LocaleAwareLink
                  prefetch="intent"
                  to={SHOP_PATH}
                  className={styles.actionGhost}
                >
                  Browse the shop
                </LocaleAwareLink>
                <LocaleAwareLink
                  prefetch="intent"
                  to="/blog"
                  className={styles.actionGhost}
                >
                  All guides
                </LocaleAwareLink>
                {hubArticle ? (
                  <LocaleAwareLink
                    prefetch="intent"
                    to={`/blog/${hubArticle.handle}`}
                    className={styles.actionGhost}
                  >
                    Complete {seriesLabel || 'guide'}
                  </LocaleAwareLink>
                ) : null}
              </div>

              <div
                className={styles.body}
                dangerouslySetInnerHTML={{__html: contentHtml}}
              />

              {related.length > 0 ? (
                <nav className={styles.deeper} aria-label="Open next">
                  <p className={styles.kicker}>
                    {relatedFromCluster ? 'Go deeper' : 'Open next'}
                  </p>
                  <ul className={styles.deeperList}>
                    {related.map((node) => (
                      <li key={node.id}>
                        <LocaleAwareLink
                          prefetch="intent"
                          to={`/blog/${node.handle}`}
                        >
                          {displayArticleTitle(node.title)}
                          <span aria-hidden="true">→</span>
                        </LocaleAwareLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <aside className={styles.banner}>
                <p className={styles.kicker}>Afterstate 001</p>
                <p className={styles.bannerTitle}>Wear it longer.</p>
                <p className={styles.bannerText}>
                  Fewer pieces, clearer cut. Open the look or browse the shop
                  from here.
                </p>
                <div className={styles.actions}>
                  <LocaleAwareLink
                    prefetch="intent"
                    to={CAMPAIGN_PATH}
                    className={styles.action}
                  >
                    Shop the look
                  </LocaleAwareLink>
                  <LocaleAwareLink
                    prefetch="intent"
                    to={SHOP_PATH}
                    className={styles.actionGhost}
                  >
                    Browse the shop
                  </LocaleAwareLink>
                </div>
              </aside>

              <ArticleShare url={url} title={headline} imageUrl={image?.url} />

              <section className={styles.author} aria-label="About the author">
                <p className={styles.kicker}>Written by</p>
                <p className={styles.authorName}>{authorName}</p>
                <p className={styles.authorBio}>
                  Afterstate writes about cloth, cut, and how people actually
                  dress — then makes fewer pieces meant to last.{' '}
                  <LocaleAwareLink prefetch="intent" to="/blog">
                    More guides
                  </LocaleAwareLink>
                  {' / '}
                  <LocaleAwareLink prefetch="intent" to={SHOP_PATH}>
                    Shop
                  </LocaleAwareLink>
                </p>
              </section>

              {newer || older ? (
                <nav className={styles.pager} aria-label="More articles">
                  {older ? (
                    <LocaleAwareLink
                      prefetch="intent"
                      to={`/blog/${older.handle}`}
                    >
                      <p className={styles.pagerLabel}>Previous</p>
                      <p className={styles.pagerTitle}>
                        {displayArticleTitle(older.title)}
                      </p>
                    </LocaleAwareLink>
                  ) : (
                    <span />
                  )}
                  {newer ? (
                    <LocaleAwareLink
                      prefetch="intent"
                      to={`/blog/${newer.handle}`}
                    >
                      <p className={styles.pagerLabel}>Next</p>
                      <p className={styles.pagerTitle}>
                        {displayArticleTitle(newer.title)}
                      </p>
                    </LocaleAwareLink>
                  ) : null}
                </nav>
              ) : null}
            </div>

            <aside className={styles.rail}>
              <div className={styles.railSticky}>
                <GuideToc headings={toc} className={styles.tocRail} />
                {related.length > 0 ? (
                  <nav className={styles.series} aria-label="Related guides">
                    <p className={styles.kicker}>
                      {relatedFromCluster
                        ? seriesLabel || 'This series'
                        : 'Open next'}
                    </p>
                    <ul className={styles.seriesList}>
                      {related.map((node) => (
                        <li key={node.id}>
                          <LocaleAwareLink
                            prefetch="intent"
                            to={`/blog/${node.handle}`}
                          >
                            {displayArticleTitle(node.title)}
                          </LocaleAwareLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}
                <LookAd products={lookProducts} />
              </div>
            </aside>
          </div>
        </div>

        {related.length > 0 ? (
          <aside className={styles.more} aria-labelledby="more-from-blog">
            <div className={styles.moreInner}>
              <div>
                <p className={styles.moreEyebrow}>
                  {relatedFromCluster && seriesLabel
                    ? seriesLabel
                    : 'Keep reading'}
                </p>
                <h2 id="more-from-blog" className={styles.moreTitle}>
                  {relatedFromCluster
                    ? 'Continue in this series'
                    : 'Related guides'}
                </h2>
                <div className={styles.actions}>
                  <LocaleAwareLink
                    prefetch="intent"
                    to="/blog"
                    className={styles.actionGhost}
                  >
                    All guides
                  </LocaleAwareLink>
                  <LocaleAwareLink
                    prefetch="intent"
                    to={SHOP_PATH}
                    className={styles.actionGhost}
                  >
                    Browse the shop
                  </LocaleAwareLink>
                </div>
              </div>
              <div className={styles.moreGrid}>
                {related.map((node) => (
                  <JournalCard
                    key={node.id}
                    to={`/blog/${node.handle}`}
                    title={displayArticleTitle(node.title)}
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
