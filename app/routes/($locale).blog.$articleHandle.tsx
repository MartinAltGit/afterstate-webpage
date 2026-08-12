import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).blog.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {PageContainer} from '~/components/layout/PageContainer';
import {ArticleJsonLd, buildMetaTags} from '~/components/seo';
import {BLOG_ARTICLE_QUERY} from '~/graphql/queries/blog';
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
  const result = await storefront
    .query(BLOG_ARTICLE_QUERY, {
      variables: {articleHandle},
      cache: storefront.CacheShort(),
    })
    .catch(() => null);

  const article = result?.blog?.articleByHandle;

  if (!article) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {
    handle: articleHandle,
    data: article,
  });

  return {article};
}

export default function BlogArticle() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author, publishedAt, excerpt, tags} =
    article;
  const url = useAbsoluteSeoUrl(`/blog/${article.handle}`);

  const publishedDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(publishedAt));

  return (
    <PageContainer narrow>
      <ArticleJsonLd
        headline={title}
        description={excerpt ?? undefined}
        url={url}
        image={image?.url}
        datePublished={publishedAt}
        authorName={author?.name ?? 'Afterstate'}
      />

      <article className={styles.article}>
        <LocaleAwareLink prefetch="intent" to="/blog" className={styles.back}>
          <span aria-hidden="true">←</span> Blog
        </LocaleAwareLink>

        <Breadcrumbs
          items={[
            {label: 'Home', to: '/'},
            {label: 'Blog', to: '/blog'},
            {label: title},
          ]}
        />

        <header className={styles.header}>
          <p className={styles.meta}>
            <time dateTime={publishedAt}>{publishedDate}</time>
            {author?.name ? (
              <>
                {' · '}
                <span>{author.name}</span>
              </>
            ) : null}
          </p>
          <h1 className={styles.title}>{title}</h1>
          {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
        </header>

        {image ? (
          <div className={styles.hero}>
            <Image
              data={image}
              className={styles.heroImage}
              sizes="(min-width: 45em) 40rem, 100vw"
              loading="eager"
            />
          </div>
        ) : null}

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
          <LocaleAwareLink prefetch="intent" to="/blog" className={styles.back}>
            <span aria-hidden="true">←</span> More from the blog
          </LocaleAwareLink>
        </footer>
      </article>
    </PageContainer>
  );
}
