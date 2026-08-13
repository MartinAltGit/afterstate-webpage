import type {
  MappedProductOptions,
  OptimisticCartLineInput,
} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {SizeSelector, isSizeOptionName} from './SizeSelector';
import {VariantSelector} from './VariantSelector';
import {DemandCapture} from '~/components/content/DemandCapture';
import {PurchaseNote} from './PurchaseNote';
import styles from './BuyControls.module.css';

export type BuyControlsSelectedVariant = {
  id: string;
  availableForSale: boolean;
  title?: string | null;
  selectedOptions?: Array<{name: string; value: string}>;
} | null;

export type BuyControlsProps = {
  productOptions: MappedProductOptions[];
  selectedVariant: BuyControlsSelectedVariant;
  /** Called after a successful add intent (e.g. open cart drawer). */
  onAddToCart?: () => void;
  analytics?: unknown;
  className?: string;
  addToCartLabel?: string;
  soldOutLabel?: string;
  /** Used for demand capture when the selected variant is unavailable. */
  productHandle?: string;
  productTitle?: string;
  /** Show final-sale / returns note under the CTA. */
  finalSale?: boolean;
  shippingNote?: string | null;
};

/**
 * Size + variant selectors, availability, and add to cart / demand capture.
 */
export function BuyControls({
  productOptions,
  selectedVariant,
  onAddToCart,
  analytics,
  className,
  addToCartLabel = 'Add to cart',
  soldOutLabel = 'Sold out',
  productHandle,
  productTitle,
  finalSale = false,
  shippingNote,
}: BuyControlsProps) {
  const available = Boolean(selectedVariant?.availableForSale);
  const lines: OptimisticCartLineInput[] = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
        },
      ]
    : [];

  const sizeOptions = productOptions.filter((o) => isSizeOptionName(o.name));
  const otherOptions = productOptions.filter((o) => !isSizeOptionName(o.name));
  const showDemand =
    Boolean(selectedVariant) &&
    !available &&
    Boolean(productHandle) &&
    Boolean(productTitle);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {otherOptions.map((option) => (
        <VariantSelector key={option.name} option={option} />
      ))}
      {sizeOptions.map((option) => (
        <SizeSelector key={option.name} option={option} />
      ))}

      <div id="product-buy-cta" className={styles.ctaBlock}>
        {showDemand ? (
          <DemandCapture
            productHandle={productHandle!}
            productTitle={productTitle!}
          />
        ) : (
          <AddToCartButton
            disabled={!selectedVariant || !available}
            onClick={onAddToCart}
            lines={lines}
            analytics={analytics}
            className={styles.cta}
          >
            {available ? addToCartLabel : soldOutLabel}
          </AddToCartButton>
        )}
        <p className={styles.ctaHint} aria-live="polite">
          {selectedVariant
            ? available
              ? 'In stock · Dispatch in 1–3 UK days'
              : 'Unavailable'
            : 'Select options'}
        </p>
      </div>

      {finalSale || shippingNote ? (
        <PurchaseNote finalSale={finalSale} shippingNote={shippingNote} />
      ) : null}
    </div>
  );
}
