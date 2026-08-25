import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).blog._index';
import {getPaginationVariables} from '@shopify/hydrogen';
import heroBlog from '~/assets/mockups/lookbook-02.jpg';
import {BlogFeatured} from '~/components/content/BlogFeatured';
import {EmptyState} from '~/components/feedback/EmptyState';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {buildMetaTags} from '~/components/seo';
import {BLOG_INDEX_QUERY} from '~/graphql/queries/blog';
import {getUiCopy, useUiCopy} from '~/lib/ui-copy';
import pageStyles from '~/components/content/BlogIndex.module.css';

export const meta: Route.MetaFunction = ({data, location}) => {
  const copy = getUiCopy(location.pathname);
  const articles = data?.blog?.articles?.nodes ?? [];
  const empty = articles.length === 0;

  return buildMetaTags({
    title: data?.blog?.seo?.title || data?.blog?.title || copy.blog.metaTitle,
    description: data?.blog?.seo?.description || copy.blog.metaDescription,
    noindex: empty,
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
  const copy = useUiCopy();
  const articles = (blog?.articles?.nodes ?? []).map((article) => ({
    id: article.id,
    to: `/blog/${article.handle}`,
    title: article.title,
    eyebrow: article.publishedAt
      ? new Intl.DateTimeFormat(copy.dateLocale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(article.publishedAt))
      : copy.blog.dateFallback,
    excerpt: article.excerpt ?? undefined,
    image: article.image,
  }));

  return (
    <div className={pageStyles.page}>
      <header className={pageStyles.masthead}>
        <div className={pageStyles.media} aria-hidden="true">
          <img
            className={pageStyles.image}
            src={heroBlog}
            alt=""
            width={2048}
            height={1152}
            decoding="async"
            fetchPriority="high"
          />
          <div className={pageStyles.veil} />
          <div className={pageStyles.grain} />
        </div>
        <div className={pageStyles.inner}>
          <p className={pageStyles.eyebrow}>{copy.blog.eyebrow}</p>
          <h1 className={pageStyles.title}>{copy.blog.title}</h1>
          <p className={pageStyles.lede}>{copy.blog.lede}</p>
        </div>
      </header>

      {articles.length > 0 ? (
        <div className={pageStyles.feed}>
          {articles.map((article, index) => (
            <div key={article.id} className={pageStyles.slot}>
              <div className={pageStyles.break} aria-hidden="true">
                <span className={pageStyles.breakLine} />
                <span className={pageStyles.breakMark} />
                <span className={pageStyles.breakLine} />
              </div>
              <BlogFeatured
                to={article.to}
                title={article.title}
                eyebrow={article.eyebrow}
                excerpt={article.excerpt}
                image={article.image}
                label={index === 0 ? copy.blog.latest : undefined}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <EditorialStage>
          <div className={stageStyles.section}>
            <EmptyState
              title={copy.blog.emptyTitle}
              message={copy.blog.emptyMessage}
              action={
                <LocaleAwareLink prefetch="intent" to="/journal">
                  {copy.blog.readJournal}
                </LocaleAwareLink>
              }
            />
          </div>
        </EditorialStage>
      )}
    </div>
  );
}
