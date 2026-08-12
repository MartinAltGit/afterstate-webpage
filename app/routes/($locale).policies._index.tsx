import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).policies._index';
import type {PoliciesQuery} from 'storefrontapi.generated';
import heroPolicies from '~/assets/mockups/lookbook-02.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {buildMetaTags} from '~/components/seo';
import {
  FALLBACK_POLICIES,
  type PolicyHandle,
} from '~/lib/policies/fallback';
import styles from '~/components/content/QuietPage.module.css';

const CORE_HANDLES: PolicyHandle[] = [
  'privacy-policy',
  'shipping-policy',
  'terms-of-service',
  'refund-policy',
];

const POLICY_BLURBS: Record<string, string> = {
  'privacy-policy': 'How we collect, use, and protect your data.',
  'shipping-policy': 'Where we ship, timing, and delivery expectations.',
  'terms-of-service': 'The rules of purchase and use of this site.',
  'refund-policy': 'Returns, exchanges, and how refunds work.',
  'subscription-policy': 'How recurring purchases and renewals work.',
};

const EXTRA_LINKS = [
  {
    label: 'Shipping & returns',
    hint: 'Plain guide',
    desc: 'UK & Europe shipping, 14-day returns, and final sale.',
    to: '/shipping-returns',
  },
  {
    label: 'Copyright',
    hint: 'IP & brand',
    desc: 'Photography, designs, and brand marks — ask before reuse.',
    to: '/copyright',
  },
  {
    label: 'Contact',
    hint: 'Write us',
    desc: 'Orders, sizing, press, or a quiet question.',
    to: '/contact',
  },
] as const;

type PolicyListItem = {
  id: string;
  title: string;
  handle: string;
};

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Policies',
    description:
      'Afterstate privacy, shipping, returns, and terms — how we sell and protect your data.',
  });
};

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);
  const shop = data.shop;

  const fromShopify = [
    shop?.privacyPolicy,
    shop?.shippingPolicy,
    shop?.termsOfService,
    shop?.refundPolicy,
    shop?.subscriptionPolicy,
  ].filter(Boolean) as PolicyListItem[];

  const byHandle = new Map(fromShopify.map((p) => [p.handle, p]));

  const policies: PolicyListItem[] = CORE_HANDLES.map((handle) => {
    const existing = byHandle.get(handle);
    if (existing) return existing;
    const fallback = FALLBACK_POLICIES[handle];
    return {
      id: `fallback:${handle}`,
      title: fallback.title,
      handle: fallback.handle,
    };
  });

  for (const item of fromShopify) {
    if (!CORE_HANDLES.includes(item.handle as PolicyHandle)) {
      policies.push(item);
    }
  }

  return {policies};
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Legal"
        title="Policies"
        support="Privacy, shipping, returns, and the terms of purchase — operated from London."
        imageSrc={heroPolicies}
        imageAlt="Afterstate lookbook still"
      />

      <div className={`${styles.root} ${styles.rootWide}`}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Store policies</p>
          <p className={styles.lede}>
            Privacy, shipping, refunds, and terms — plus plain-language notes
            for shipping and copyright.
          </p>
          <hr className={styles.rule} />
        </header>

        <ul className={styles.links}>
          {policies.map((policy) => (
            <li key={policy.id} className={styles.linkItem}>
              <LocaleAwareLink
                className={styles.link}
                prefetch="intent"
                to={`/policies/${policy.handle}`}
              >
                <span className={styles.linkCopy}>
                  <span className={styles.linkLabel}>{policy.title}</span>
                  {POLICY_BLURBS[policy.handle] ? (
                    <span className={styles.linkDesc}>
                      {POLICY_BLURBS[policy.handle]}
                    </span>
                  ) : null}
                </span>
                <span className={styles.linkHint}>Read</span>
              </LocaleAwareLink>
            </li>
          ))}
        </ul>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Also useful</h2>
          <ul className={styles.links}>
            {EXTRA_LINKS.map((item) => (
              <li key={item.to} className={styles.linkItem}>
                <LocaleAwareLink
                  className={styles.link}
                  prefetch="intent"
                  to={item.to}
                >
                  <span className={styles.linkCopy}>
                    <span className={styles.linkLabel}>{item.label}</span>
                    <span className={styles.linkDesc}>{item.desc}</span>
                  </span>
                  <span className={styles.linkHint}>{item.hint}</span>
                </LocaleAwareLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
