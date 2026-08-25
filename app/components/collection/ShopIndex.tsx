import {Image} from '@shopify/hydrogen';
import {Link, useLocation} from 'react-router';
import {Reveal} from '~/components/motion/Reveal';
import {getShopCardImage, isShopCardStill} from '~/lib/shop-card-media';
import {
  getFamilyCoverProduct,
  shopCatalogSearch,
  type ShopDesignFamily,
  type ShopFormFilter,
} from '~/lib/shop-catalog';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import styles from './ShopIndex.module.css';

export type ShopIndexProps = {
  families: Array<ShopDesignFamily<CollectionGridProduct>>;
  form?: ShopFormFilter;
};

/**
 * Shop-by-design row — compact collection tiles with a caption bar.
 */
export function ShopIndex({families, form = 'all'}: ShopIndexProps) {
  const {pathname} = useLocation();

  if (families.length < 2) return null;

  return (
    <section className={styles.root} aria-labelledby="shop-by-design">
      <header className={styles.header}>
        <h2 id="shop-by-design" className={styles.title}>
          Shop by design
        </h2>
        <Link
          to={`${pathname}${shopCatalogSearch('all', 'all')}`}
          prefetch="intent"
          className={styles.viewAll}
        >
          View all
          <svg viewBox="0 0 24 8" className={styles.viewArrow} aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              d="M0 4h22M18.5 1 22 4l-3.5 3"
            />
          </svg>
        </Link>
      </header>

      <ul className={styles.grid}>
        {families.map((family, index) => {
          const cover = getFamilyCoverProduct(family, form);
          const coverImage = cover ? getShopCardImage(cover) : null;

          return (
            <Reveal key={family.id} as="li" delayMs={Math.min(index, 3) * 70}>
              <Link
                to={`${pathname}${shopCatalogSearch('all', family.id)}`}
                prefetch="intent"
                className={styles.tile}
              >
                <div
                  className={[
                    styles.media,
                    isShopCardStill(cover?.handle) ? styles.mediaStill : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {coverImage?.url ? (
                    isShopCardStill(cover?.handle) ? (
                      <img
                        src={coverImage.url}
                        alt=""
                        width={coverImage.width ?? 1536}
                        height={coverImage.height ?? 2048}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        className={styles.image}
                      />
                    ) : (
                      <Image
                        data={coverImage}
                        alt=""
                        loading={index < 2 ? 'eager' : 'lazy'}
                        sizes="(min-width: 70em) 22vw, (min-width: 45em) 44vw, 46vw"
                        className={styles.image}
                      />
                    )
                  ) : (
                    <span className={styles.placeholder} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.bar}>
                  <h3 className={styles.name}>{family.name}</h3>
                  <span className={styles.shop}>
                    Shop now
                    <span className={styles.rule} aria-hidden="true" />
                    <svg
                      viewBox="0 0 16 16"
                      className={styles.arrow}
                      aria-hidden="true"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        d="M2 8h12M10.5 4.5 14 8l-3.5 3.5"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
