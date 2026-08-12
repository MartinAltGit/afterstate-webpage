import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).journal.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {FallbackJournalArticleView} from '~/components/journal/FallbackJournalArticle';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {PageContainer} from '~/components/layout/PageContainer';
import {ArticleJsonLd, buildMetaTags} from '~/components/seo';
import {JOURNAL_ARTICLE_QUERY} from '~/graphql/queries/journal';
import {getFallbackJournalArticle} from '~/lib/journal/fallback';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useAbsoluteSeoUrl} from '~/lib/seo/useAbsoluteSeoUrl';

export const meta: Route.MetaFunction = ({data}) => {
  if (data?.source === 'fallback' && data.fallback) {
    return buildMetaTags({
      title: data.fallback.title,
      description: data.fallback.seoDescription,
      type: 'article',
      imageUrl: data.fallback.hero.url,
      imageAlt: data.fallback.hero.altText,
    });
  }

  const article = data?.article;
  return buildMetaTags({
    title: article?.seo?.title || article?.title || 'Journal',
    description:
      article?.seo?.description ||
      article?.excerpt ||
      'An Afterstate journal essay.',
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
    .query(JOURNAL_ARTICLE_QUERY, {
      variables: {articleHandle},
      cache: storefront.CacheLong(),
    })
    .catch(() => null);

  const article = result?.blog?.articleByHandle;

  if (article) {
    redirectIfHandleIsLocalized(request, {
      handle: articleHandle,
      data: article,
    });

    return {
      source: 'shopify' as const,
      article,
      fallback: null,
      relatedProducts: null as null,
    };
  }

  const fallback = getFallbackJournalArticle(articleHandle);
  if (fallback) {
    return {
      source: 'fallback' as const,
      article: null,
      fallback,
      relatedProducts: null as null,
    };
  }

  throw new Response('Not found', {status: 404});
}

export default function JournalArticle() {
  const data = useLoaderData<typeof loader>();

  if (data.source === 'fallback' && data.fallback) {
    const article = data.fallback;
    return (
      <FallbackJournalArticleWithSeo article={article} />
    );
  }

  const {article, relatedProducts: _relatedProducts} = data;
  if (!article) {
    throw new Response('Not found', {status: 404});
  }

  return <ShopifyJournalArticle article={article} />;
}

function FallbackJournalArticleWithSeo({
  article,
}: {
  article: NonNullable<ReturnType<typeof getFallbackJournalArticle>>;
}) {
  const url = useAbsoluteSeoUrl(`/journal/${article.handle}`);

  return (
    <>
      <ArticleJsonLd
        headline={article.title}
        description={article.excerpt}
        url={url}
        image={article.hero.url}
        datePublished={article.publishedAt}
        authorName={article.authorName}
      />
      <FallbackJournalArticleView article={article} />
    </>
  );
}

function ShopifyJournalArticle({
  article,
}: {
  article: NonNullable<
    Extract<Awaited<ReturnType<typeof loader>>, {source: 'shopify'}>['article']
  >;
}) {
  const {title, image, contentHtml, author, publishedAt, excerpt} = article;

  const publishedDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(publishedAt));

  const url = useAbsoluteSeoUrl(`/journal/${article.handle}`);

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

      <Breadcrumbs
        items={[
          {label: 'Home', to: '/'},
          {label: 'Journal', to: '/journal'},
          {label: title},
        ]}
      />

      <article>
        <header style={{marginBlock: '2rem'}}>
          <p style={{marginBottom: '0.5rem'}}>
            <time dateTime={publishedAt}>{publishedDate}</time>
            {author?.name ? (
              <>
                {' · '}
                <span>{author.name}</span>
              </>
            ) : null}
          </p>
          <h1>{title}</h1>
        </header>

        {image ? (
          <Image data={image} sizes="(min-width: 45em) 40rem, 100vw" loading="eager" />
        ) : null}

        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          style={{marginBlock: '2rem'}}
        />
      </article>
    </PageContainer>
  );
}
