import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {buildMetaTags} from '~/components/seo';
import {
  isPolicyHandle,
  resolvePolicyContent,
  type PolicyHandle,
} from '~/lib/policies/fallback';
import styles from '~/components/content/QuietPage.module.css';
import policyStyles from '~/components/content/PolicyBody.module.css';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

const HANDLE_TO_FIELD: Record<PolicyHandle, SelectedPolicies> = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
};

export const meta: Route.MetaFunction = ({data}) => {
  const title = data?.policy.title ?? 'Policy';
  return buildMetaTags({
    title,
    description: `Read the Afterstate ${title.toLowerCase()}: how we handle your order, data, and rights.`,
  });
};

export async function loader({params, context}: Route.LoaderArgs) {
  const handle = params.handle;
  if (!handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  let shopifyPolicy: {
    id?: string | null;
    title?: string | null;
    body?: string | null;
    handle?: string | null;
  } | null = null;

  if (isPolicyHandle(handle)) {
    const policyName = HANDLE_TO_FIELD[handle];
    const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
      variables: {
        privacyPolicy: false,
        shippingPolicy: false,
        termsOfService: false,
        refundPolicy: false,
        [policyName]: true,
        language: context.storefront.i18n?.language,
      },
    });
    shopifyPolicy = data.shop?.[policyName] ?? null;
  } else {
    // Unknown handle — try Shopify camelCase mapping for custom policies
    const policyName = handle.replace(
      /-([a-z])/g,
      (_: unknown, m1: string) => m1.toUpperCase(),
    ) as SelectedPolicies;

    if (
      policyName === 'privacyPolicy' ||
      policyName === 'shippingPolicy' ||
      policyName === 'termsOfService' ||
      policyName === 'refundPolicy'
    ) {
      const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
        variables: {
          privacyPolicy: false,
          shippingPolicy: false,
          termsOfService: false,
          refundPolicy: false,
          [policyName]: true,
          language: context.storefront.i18n?.language,
        },
      });
      shopifyPolicy = data.shop?.[policyName] ?? null;
    }
  }

  const policy = resolvePolicyContent(handle, shopifyPolicy);

  if (!policy || !policy.body) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className={styles.world}>
      <div className={styles.root}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>
            <LocaleAwareLink prefetch="intent" to="/policies">
              ← Policies
            </LocaleAwareLink>
          </p>
          <h1 className={styles.legalTitle}>{policy.title}</h1>
          <hr className={styles.rule} />
        </header>

        <div
          className={policyStyles.body}
          dangerouslySetInnerHTML={{__html: policy.body}}
        />
      </div>
    </div>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
