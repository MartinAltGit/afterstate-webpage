import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections._index';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';
import campaignLook from '~/assets/mockups/campaign-look-new.jpg';
import heroLimited from '~/assets/mockups/hero-campaign.jpg';
import {COLLECTIONS_QUERY} from '~/graphql/queries/collection';
import {CampaignLook} from '~/sections/CampaignLook';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {EditorialStage} from '~/components/layout/EditorialStage';
import stageStyles from '~/components/layout/EditorialStage.module.css';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {EmptyState} from '~/components/feedback/EmptyState';
import type {CollectionCardFragment} from 'storefrontapi.generated';
import styles from '~/components/collection/CollectionEditorialGrid.module.css';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Afterstate | Limited'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections-index">
      <PageHero
        eyebrow="Limited edition"
        title="Limited"
        support="Short runs. Clear intent. When a drop is gone, it stays gone."
        imageSrc={heroLimited}
        imageAlt="Afterstate campaign look — teal hoodie, peach tee, mustard cap"
      />

      <CampaignLook
        imageSrc={campaignLook}
        eyebrow="Now shipping"
        title="001 — No Rush"
        caption="The first Afterstate drop — fewer pieces, more room to live in them."
        ctaLabel="Shop Afterstate 001"
        ctaTo="/collections/afterstate-001"
      />

      <EditorialStage>
        <div className={stageStyles.section}>
          <Reveal as="header" className={stageStyles.header}>
            <p className={stageStyles.eyebrow}>Chapters</p>
            <h2 className={stageStyles.title}>Collections</h2>
            <p className={stageStyles.lede}>
              Each collection is a chapter — clothes for a slower pace.
            </p>
          </Reveal>

          <Reveal delayMs={90}>
            <Pagination connection={collections}>
              {({nodes, isLoading, PreviousLink, NextLink}) => (
                <div>
                  <div className={stageStyles.pager}>
                    <PreviousLink>
                      {isLoading ? (
                        'Loading...'
                      ) : (
                        <span>
                          <span aria-hidden="true">↑</span> Load previous
                        </span>
                      )}
                    </PreviousLink>
                  </div>

                  {nodes.length === 0 ? (
                    <EmptyState
                      title="No collections yet"
                      message="Afterstate limited drops will appear here."
                      action={
                        <LocaleAwareLink to="/shop" prefetch="intent">
                          Shop all
                        </LocaleAwareLink>
                      }
                    />
                  ) : (
                    <ul className={styles.grid}>
                      {(nodes as CollectionCardFragment[]).map(
                        (collection, index) => (
                          <Reveal
                            key={collection.id}
                            as="li"
                            delayMs={Math.min(index, 6) * 100}
                          >
                            <LocaleAwareLink
                              className={styles.card}
                              to={`/collections/${collection.handle}`}
                              prefetch="intent"
                            >
                              <div className={styles.media}>
                                {collection.image ? (
                                  <Image
                                    alt={
                                      collection.image.altText ||
                                      collection.title
                                    }
                                    data={collection.image}
                                    className={styles.image}
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                    sizes="(min-width: 45em) 50vw, 100vw"
                                  />
                                ) : (
                                  <div className={styles.placeholder} />
                                )}
                              </div>
                              <div className={styles.copy}>
                                <p className={styles.cardEyebrow}>Collection</p>
                                <h3 className={styles.cardTitle}>
                                  {collection.title}
                                </h3>
                                {collection.description ? (
                                  <p className={styles.cardBody}>
                                    {collection.description}
                                  </p>
                                ) : null}
                              </div>
                            </LocaleAwareLink>
                          </Reveal>
                        ),
                      )}
                    </ul>
                  )}

                  <div className={stageStyles.pager}>
                    <span />
                    <NextLink>
                      {isLoading ? (
                        'Loading...'
                      ) : (
                        <span>
                          Load more <span aria-hidden="true">↓</span>
                        </span>
                      )}
                    </NextLink>
                  </div>
                </div>
              )}
            </Pagination>
          </Reveal>
        </div>
      </EditorialStage>

      <OpeningStatement
        section={{
          id: 'limited-closing',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: 'Life beyond the rush.',
          body: 'Every piece is limited edition. Short runs. No restocks.',
        }}
      />
    </div>
  );
}
