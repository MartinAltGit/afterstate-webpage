import type {Route} from './+types/($locale).size-guide';
import {EditorialText} from '~/components/content/EditorialText';
import {PageContainer} from '~/components/layout/PageContainer';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Size guide',
    description:
      'How Afterstate garments are intended to fit — measured, considered, and easy to live in.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function SizeGuidePage() {
  return (
    <PageContainer narrow>
      <EditorialText eyebrow="Fit" title="Size guide">
        <p>
          Afterstate pieces are cut for ease without bulk. If you prefer a closer
          fit, consider sizing down; for the intended drape, take your usual size.
        </p>
        <p>
          Measurements for each style appear on the product page. Model
          information and fit notes are listed there when available.
        </p>
        <p>
          Between sizes? Choose the larger for movement and layering, or write us
          at contact — we will help you decide.
        </p>
      </EditorialText>
    </PageContainer>
  );
}
