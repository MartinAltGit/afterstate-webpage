import type {Route} from './+types/($locale).shipping-returns';
import {EditorialText} from '~/components/content/EditorialText';
import {PageContainer} from '~/components/layout/PageContainer';
import {Link} from 'react-router';
import {buildMetaTags} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Shipping & returns',
    description:
      'How Afterstate ships, how long it takes, and how returns work when something is not right.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function ShippingReturnsPage() {
  return (
    <PageContainer narrow>
      <EditorialText eyebrow="Orders" title="Shipping & returns">
        <p>
          We ship to the markets we sell in. Delivery windows and duties depend
          on your address and appear at checkout before you pay.
        </p>
        <p>
          Once an order ships, you receive tracking by email. If something is
          delayed, reach out and we will help track it down.
        </p>
        <p>
          Unworn items with tags may be returned within the window stated at
          checkout and on your order confirmation. Final sale pieces are marked
          clearly on the product page.
        </p>
        <p>
          Formal policy text lives under{' '}
          <Link to="/policies" prefetch="intent">
            Policies
          </Link>
          . For a specific order, your account orders page is the fastest place
          to start.
        </p>
      </EditorialText>
    </PageContainer>
  );
}
