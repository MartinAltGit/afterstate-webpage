import {Image} from '@shopify/hydrogen';
import campaignPortrait from '~/assets/mockups/campaign-look-portrait.jpg';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {CAMPAIGN_PATH, SHOP_PATH} from '~/lib/content-paths';
import {splitProductTitle} from '~/lib/product-title';
import type {ProductCardFragment} from 'storefrontapi.generated';
import styles from './LookAd.module.css';

export type LookAdProps = {
  products?: ProductCardFragment[];
  className?: string;
};

/**
 * Shop-the-look rail beside a fashion article — campaign still, then the pieces.
 */
export function LookAd({products = [], className}: LookAdProps) {
  const pieces = products.slice(0, 3);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="look-ad-title"
    >
      <LocaleAwareLink
        to={CAMPAIGN_PATH}
        prefetch="intent"
        className={styles.look}
      >
        <div className={styles.media}>
          <img
            className={styles.image}
            src={campaignPortrait}
            alt="Model wearing the Afterstate 001 hoodie"
            width={972}
            height={1296}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} aria-hidden="true" />
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Afterstate 001</p>
            <h2 id="look-ad-title" className={styles.title}>
              No rush.
              <span className={styles.accent}> Wear it longer.</span>
            </h2>
            <span className={styles.cta}>
              Shop the look <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </LocaleAwareLink>

      {pieces.length > 0 ? (
        <div className={styles.collection}>
          <p className={styles.collectionEyebrow}>The collection</p>
          <ul className={styles.pieces}>
            {pieces.map((product) => {
              const {headline} = splitProductTitle(product.title);
              const image = product.featuredImage;

              return (
                <li key={product.id}>
                  <LocaleAwareLink
                    to={`/products/${product.handle}`}
                    prefetch="intent"
                    className={styles.piece}
                  >
                    <div className={styles.thumb}>
                      {image?.url ? (
                        <Image
                          data={image}
                          alt={image.altText || headline}
                          className={styles.thumbImage}
                          sizes="(max-width: 30em) 30vw, 72px"
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.thumbFallback} aria-hidden="true" />
                      )}
                    </div>
                    <div className={styles.pieceMeta}>
                      <p className={styles.pieceTitle}>{headline}</p>
                      <ProductPrice
                        price={product.priceRange?.minVariantPrice}
                        className={styles.piecePrice}
                      />
                    </div>
                  </LocaleAwareLink>
                </li>
              );
            })}
          </ul>
          <LocaleAwareLink
            to={SHOP_PATH}
            prefetch="intent"
            className={styles.all}
          >
            View all pieces <span aria-hidden="true">→</span>
          </LocaleAwareLink>
        </div>
      ) : null}
    </div>
  );
}
