import type {Route} from './+types/($locale).journal._index';
import {JournalHub} from '~/components/journal/JournalHub';
import {buildMetaTags} from '~/components/seo';
import {getUiCopy} from '~/lib/ui-copy';

export const meta: Route.MetaFunction = ({location}) => {
  const copy = getUiCopy(location.pathname);
  return buildMetaTags({
    title: copy.hub.metaTitle,
    description: copy.hub.metaDescription,
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function JournalIndex() {
  return <JournalHub />;
}
