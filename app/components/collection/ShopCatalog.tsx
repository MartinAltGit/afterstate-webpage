import {ShopFamily} from '~/components/collection/ShopFamily';
import {ShopFilters} from '~/components/collection/ShopFilters';
import {EmptyState} from '~/components/feedback/EmptyState';
import {Reveal} from '~/components/motion/Reveal';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import stillImage from '~/assets/mockups/shop-interstitial.jpg';
import {getFamilyPieces, groupShopFamilies} from '~/lib/shop-catalog';
import type {ProductCardFragment} from 'storefrontapi.generated';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import styles from './ShopCatalog.module.css';

export type ShopCatalogProps = {
  products: ProductCardFragment[];
};

function Interstitial() {
  return (
    <figure className={styles.interstitial}>
      <div className={styles.interstitialMedia}>
        <img
          className={styles.interstitialImage}
          src={stillImage}
          alt="A woman in the bone After This tee and bone cap beside a man in the forest hoodie layered over the cream tee."
          width={3168}
          height={1344}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.interstitialVeil} aria-hidden="true" />
      </div>
      <figcaption className={styles.interstitialCopy}>
        <p className={styles.interstitialEyebrow}>The Afterstate way</p>
        <p className={styles.interstitialLine}>
          Objects for the afterhours — cut to live in,{' '}
          <span className={styles.interstitialAccent}>
            not to chase a trend.
          </span>
        </p>
      </figcaption>
    </figure>
  );
}

function Outro() {
  return (
    <section className={styles.outro} aria-labelledby="shop-outro">
      <p className={styles.outroEyebrow}>No restocks</p>
      <h2 id="shop-outro" className={styles.outroTitle}>
        When it&rsquo;s gone,{' '}
        <span className={styles.outroAccent}>it&rsquo;s gone.</span>
      </h2>
      <p className={styles.outroSupport}>
        Every run is numbered and final. Read why we make less — or browse the
        stories behind the drop.
      </p>
      <div className={styles.outroActions}>
        <LocaleAwareLink to="/philosophy" className={styles.outroLink}>
          Our philosophy
        </LocaleAwareLink>
        <LocaleAwareLink to="/journal" className={styles.outroLinkGhost}>
          The journal
        </LocaleAwareLink>
      </div>
    </section>
  );
}

/**
 * Drop index — left-rail ledger, design chapters, outro.
 */
export function ShopCatalog({products}: ShopCatalogProps) {
  const families = groupShopFamilies(products as CollectionGridProduct[]);
  const nonEmpty = families.filter((family) => family.products.length > 0);

  if (nonEmpty.length === 0) {
    return (
      <EmptyState
        title="Nothing in the drop yet"
        message="Afterstate designs will appear here."
      />
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.stage}>
        <ShopFilters
          families={nonEmpty.map((family) => ({
            id: family.id,
            name: family.name,
            count: getFamilyPieces(family).length,
          }))}
          className={styles.nav}
        />
        <div className={styles.main}>
          <div className={styles.board} id="shop-board">
            {nonEmpty.map((family, index) => {
              const showInterstitial = nonEmpty.length > 2 && index === 1;
              return (
                <Reveal
                  key={family.id}
                  as="div"
                  className={styles.chapterWrap}
                  delayMs={Math.min(index, 4) * 60}
                >
                  <ShopFamily family={family} index={index} />
                  {showInterstitial ? <Interstitial /> : null}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
      <Outro />
    </div>
  );
}
