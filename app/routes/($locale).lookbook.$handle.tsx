import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).lookbook.$handle';
import {LookbookSequence, type LookbookFrame} from '~/components/content/LookbookSequence';
import {EmptyState} from '~/components/feedback/EmptyState';
import {PageContainer} from '~/components/layout/PageContainer';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {buildMetaTags} from '~/components/seo';
import {LOOKBOOK_BY_HANDLE_QUERY} from '~/graphql/queries/campaign';

export const meta: Route.MetaFunction = ({data}) => {
  const title = data?.title ?? 'Lookbook';
  return buildMetaTags({
    title,
    description: `Afterstate lookbook — ${title}.`,
  });
};

export async function loader({context, params}: Route.LoaderArgs) {
  const handle = params.handle;

  if (!handle) {
    throw new Response('Not found', {status: 404});
  }

  const {storefront} = context;
  const result = await storefront
    .query(LOOKBOOK_BY_HANDLE_QUERY, {
      variables: {handle},
      cache: storefront.CacheShort(),
    })
    .catch(() => null);

  const metaobject = result?.metaobject ?? null;
  const title =
    readMetaobjectField(metaobject, 'title') ||
    humanizeHandle(handle);

  const frames = framesFromMetaobject(metaobject);

  return {
    handle,
    title,
    lookbook: metaobject,
    frames,
  };
}

export default function LookbookPage() {
  const {handle, title, lookbook, frames} = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          {label: 'Home', to: '/'},
          {label: 'Lookbook'},
          {label: title},
        ]}
      />

      {lookbook || frames.length ? (
        <LookbookSequence
          eyebrow="Lookbook"
          title={title}
          frames={frames.length ? frames : undefined}
        />
      ) : (
        <>
          <LookbookSequence eyebrow="Lookbook" title={title} />
          <EmptyState
            title={title}
            message={`Lookbook “${handle}” will fill in when the Afterstate lookbook metaobject is published. Until then, this page holds the wireframe sequence.`}
          />
        </>
      )}
    </PageContainer>
  );
}

type MetaobjectLike = {
  fields?: Array<{
    key: string;
    value?: string | null;
    references?: {
      nodes?: Array<{
        image?: LookbookFrame['image'];
        id?: string;
      } | null>;
    } | null;
  }> | null;
} | null;

function readMetaobjectField(
  metaobject: MetaobjectLike,
  key: string,
): string | null {
  const field = metaobject?.fields?.find((f) => f.key === key);
  return field?.value ?? null;
}

function framesFromMetaobject(metaobject: MetaobjectLike): LookbookFrame[] {
  const framesField = metaobject?.fields?.find(
    (f) => f.key === 'frames' || f.key === 'images',
  );
  const nodes = framesField?.references?.nodes ?? [];
  return nodes
    .filter(Boolean)
    .map((node, index) => ({
      id: node?.id ?? `frame-${index}`,
      caption: `Look ${String(index + 1).padStart(2, '0')}`,
      image: node?.image ?? null,
    }));
}

function humanizeHandle(handle: string): string {
  return handle
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
