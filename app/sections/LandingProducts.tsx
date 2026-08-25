import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import {ShopPieceCard} from '~/components/commerce/ShopPieceCard';
import {MagneticLink} from '~/components/motion/MagneticLink';
import {Reveal} from '~/components/motion/Reveal';
import {
  getFamilyCoverProduct,
  groupShopFamilies,
} from '~/lib/shop-catalog';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './LandingProducts.module.css';

export type LandingProductsProps = {
  products?: CollectionGridProduct[] | null;
  className?: string;
};

const PREVIEW_COUNT = 4;

function previewDrop(products: CollectionGridProduct[]) {
  return groupShopFamilies(products)
    .map((family) => getFamilyCoverProduct(family))
    .filter((product): product is CollectionGridProduct => Boolean(product))
    .slice(0, PREVIEW_COUNT);
}

/**
 * One-line drop preview under the hero, then a CTA into the full shop.
 */
export function LandingProducts({products, className}: LandingProductsProps) {
  const localePrefix = useLocalePathPrefix();
  const copy = useUiCopy();
  const pieces = previewDrop(products ?? []);

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="landing-products-title"
    >
      <Reveal as="header" className={styles.header}>
        <p className={styles.eyebrow}>{copy.landing.dropEyebrow}</p>
        <h2 id="landing-products-title" className={styles.title}>
          Afterstate 001
        </h2>
        <p className={styles.lede}>{copy.landing.dropLede}</p>
      </Reveal>

      {pieces.length === 0 ? (
        <p className={styles.empty}>{copy.landing.empty}</p>
      ) : (
        <ul className={styles.row}>
          {pieces.map((product, index) => (
            <Reveal
              key={product.id}
              as="li"
              delayMs={Math.min(index, 3) * 70}
            >
              <ShopPieceCard
                product={product}
                sizes="(min-width: 70em) 22vw, (min-width: 45em) 40vw, 72vw"
              />
            </Reveal>
          ))}
        </ul>
      )}

      <Reveal delayMs={160} className={styles.footer}>
        <MagneticLink
          className={styles.dropCta}
          variant="bright"
          to={prefixPathWithLocale('/shop', localePrefix)}
        >
          {copy.landing.allDrop}
        </MagneticLink>
      </Reveal>
    </section>
  );
}
