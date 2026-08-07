import type {Route} from './+types/($locale).about';
import {EditorialText} from '~/components/content/EditorialText';
import {PageContainer} from '~/components/layout/PageContainer';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'About',
    description:
      'Afterstate is a clothing brand for life beyond the rush — fewer pieces, clearer intent.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function AboutPage() {
  return (
    <PageContainer narrow>
      <EditorialText eyebrow="Afterstate" title="About">
        <p>
          Afterstate exists for the part of life that comes after the noise —
          when clothes should feel settled, useful, and quietly considered.
        </p>
        <p>
          We make fewer pieces with clearer intent: durable fabrics, honest
          construction, and silhouettes that hold up beyond a single season.
        </p>
        <p>
          Afterstate 001: No Rush is the first collection — a statement against
          forced pace, and an invitation to wear things longer.
        </p>
      </EditorialText>
    </PageContainer>
  );
}
