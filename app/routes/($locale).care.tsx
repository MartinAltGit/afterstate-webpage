import type {Route} from './+types/($locale).care';
import {EditorialText} from '~/components/content/EditorialText';
import {PageContainer} from '~/components/layout/PageContainer';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Care',
    description:
      'How to care for Afterstate garments so they last — wash less, mend when needed, wear longer.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function CarePage() {
  return (
    <PageContainer narrow>
      <EditorialText eyebrow="Longevity" title="Care">
        <p>
          Clothes last when they are washed with restraint. Air out between wears,
          spot-clean when you can, and follow the care label on each piece.
        </p>
        <p>
          Prefer cool water, gentle cycles, and low heat — or hang dry. Avoid
          harsh detergents and unnecessary softener; they shorten the life of
          fabric and finish.
        </p>
        <p>
          Small repairs keep garments in rotation. A loose stitch or missing
          button is usually worth fixing before replacing.
        </p>
      </EditorialText>
    </PageContainer>
  );
}
