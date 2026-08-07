import {data as remixData, Outlet, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).account';
import {AccountNavigation} from '~/components/navigation/AccountNavigation';
import {PageContainer} from '~/components/layout/PageContainer';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <PageContainer>
      <div className="account">
        <h1>{heading}</h1>
        <AccountNavigation />
        <Outlet context={{customer}} />
      </div>
    </PageContainer>
  );
}
