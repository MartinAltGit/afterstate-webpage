import type {Route} from './+types/($locale).journal._index';
import {JournalHub} from '~/components/journal/JournalHub';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Journal',
    description:
      'Afterstate journal — essays, the brand, and notes from the fashion world.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function JournalIndex() {
  return <JournalHub />;
}
