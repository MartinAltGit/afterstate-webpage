import type {Route} from './+types/($locale).journal._index';
import {JournalHub} from '~/components/journal/JournalHub';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Journal',
    description:
      'The Afterstate journal — brand essays, the thinking behind the clothes, and notes from a slower way of dressing.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function JournalIndex() {
  return <JournalHub />;
}
