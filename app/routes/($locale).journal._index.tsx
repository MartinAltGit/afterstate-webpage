import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).journal._index';
import {getPaginationVariables} from '@shopify/hydrogen';
import {JournalCard} from '~/components/content/JournalCard';
import {EmptyState} from '~/components/feedback/EmptyState';
import {PageContainer} from '~/components/layout/PageContainer';
import {ContentSection} from '~/components/layout/ContentSection';
import {buildMetaTags} from '~/components/seo';
import {JOURNAL_INDEX_QUERY} from '~/graphql/queries/journal';

export const meta: Route.MetaFunction = ({data}) => {
  return buildMetaTags({
    title: data?.blog?.seo?.title || data?.blog?.title || 'Journal',
    description:
      data?.blog?.seo?.description ||
      'Notes from Afterstate — campaigns, process, and the thinking behind the clothes.',
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
  const articles = blog?.articles?.nodes ?? [];

  return (
    <PageContainer>
      <ContentSection eyebrow="Afterstate" title="Journal">
        <p>
          Campaign notes, process, and the quieter thinking behind the clothes.
        </p>
      </ContentSection>

      {!blog || !articles.length ? (
        <EmptyState
          title="Journal coming soon"
          message="When the Afterstate journal publishes, essays and campaign notes will appear here. Mock.shop and early storefronts may not have a journal blog yet."
          action={
            <Link to="/collections/afterstate-001" prefetch="intent">
              Explore Afterstate 001
            </Link>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
            paddingBlockEnd: '3rem',
          }}
        >
          {articles.map((article) => (
            <JournalCard
              key={article.id}
              to={`/journal/${article.handle}`}
              title={article.title}
              eyebrow={
                article.publishedAt
                  ? new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date(article.publishedAt))
                  : 'Journal'
              }
              excerpt={article.excerpt ?? undefined}
              image={article.image}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
