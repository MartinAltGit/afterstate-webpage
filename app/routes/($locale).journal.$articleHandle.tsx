import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).journal.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {PageContainer} from '~/components/layout/PageContainer';
import {ArticleJsonLd, buildMetaTags} from '~/components/seo';
import {JOURNAL_ARTICLE_QUERY} from '~/graphql/queries/journal';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
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

  if (!article) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {
    handle: articleHandle,
    data: article,
  });

  return {
    article,
    /** Related products via article metafields can be wired later. */
    relatedProducts: null as null,
  };
}

export default function JournalArticle() {
  const {article, relatedProducts} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author, publishedAt, excerpt} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(publishedAt));

  const canonicalPath = `/journal/${article.handle}`;

  return (
    <PageContainer narrow>
      <ArticleJsonLd
        headline={title}
        description={excerpt ?? undefined}
        url={canonicalPath}
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

        {/* Slot for related products when article metafields are connected */}
        {relatedProducts ? null : null}
      </article>
    </PageContainer>
  );
}
