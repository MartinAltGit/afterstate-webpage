import {Image} from '@shopify/hydrogen';
import campaignPortrait from '~/assets/mockups/campaign-look-portrait.jpg';
import {ProductPrice} from '~/components/commerce/ProductPrice';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {CAMPAIGN_PATH, SHOP_PATH} from '~/lib/content-paths';
import {splitProductTitle} from '~/lib/product-title';
import {useUiCopy} from '~/lib/ui-copy';
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
  const copy = useUiCopy();
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
            alt="Model in the Afterstate 001 No Rush look"
            width={1696}
            height={2528}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} aria-hidden="true" />
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{copy.lookAd.eyebrow}</p>
            <h2 id="look-ad-title" className={styles.title}>
              {copy.lookAd.title}
              <span className={styles.accent}> {copy.lookAd.accent}</span>
            </h2>
            <span className={styles.cta}>
              {copy.lookAd.cta} <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </LocaleAwareLink>

      {pieces.length > 0 ? (
        <div className={styles.collection}>
          <p className={styles.collectionEyebrow}>{copy.lookAd.collectionEyebrow}</p>
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
            {copy.lookAd.viewAll} <span aria-hidden="true">→</span>
          </LocaleAwareLink>
        </div>
      ) : null}
    </div>
  );
}
