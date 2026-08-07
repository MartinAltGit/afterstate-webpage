import type {Route} from './+types/($locale).philosophy';
import {EditorialText} from '~/components/content/EditorialText';
import {ManifestoBlock} from '~/components/content/ManifestoBlock';
import {PageContainer} from '~/components/layout/PageContainer';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Philosophy',
    description:
      'Calm, intentional clothing. Afterstate is about pace, permanence, and choosing less with care.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function PhilosophyPage() {
  return (
    <PageContainer narrow>
      <EditorialText eyebrow="Afterstate" title="Philosophy">
        <p>
          Afterstate is not about more. It is about enough — enough quality,
          enough thought, enough time to live in what you wear.
        </p>
        <p>
          We design for calm intent: pieces that do not shout for attention, and
          do not need to be replaced when the calendar turns.
        </p>
      </EditorialText>

      <ManifestoBlock label="Meaning">
        <p>
          The name Afterstate points to what remains when urgency fades — a
          steadier way of dressing, buying, and belonging to your wardrobe.
        </p>
        <p>
          No Rush is the practice: slow the drop, respect the material, and leave
          room for the garment to become yours.
        </p>
      </ManifestoBlock>
    </PageContainer>
  );
}
