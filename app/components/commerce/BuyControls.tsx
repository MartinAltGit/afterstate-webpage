import type {
  MappedProductOptions,
  OptimisticCartLineInput,
} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {SizeSelector, isSizeOptionName} from './SizeSelector';
import {VariantSelector} from './VariantSelector';
import styles from './BuyControls.module.css';

export type BuyControlsSelectedVariant = {
  id: string;
  availableForSale: boolean;
  title?: string | null;
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
};

/**
 * Size + variant selectors, availability, and add to cart.
 */
export function BuyControls({
  productOptions,
  selectedVariant,
  onAddToCart,
  analytics,
  className,
  addToCartLabel = 'Add to cart',
  soldOutLabel = 'Sold out',
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

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {otherOptions.map((option) => (
        <VariantSelector key={option.name} option={option} />
      ))}
      {sizeOptions.map((option) => (
        <SizeSelector key={option.name} option={option} />
      ))}

      <p className={styles.availability} aria-live="polite">
        {selectedVariant
          ? available
            ? 'In stock'
            : 'Unavailable'
          : 'Select options'}
      </p>

      <AddToCartButton
        disabled={!selectedVariant || !available}
        onClick={onAddToCart}
        lines={lines}
        analytics={analytics}
        className={styles.cta}
      >
        {available ? addToCartLabel : soldOutLabel}
      </AddToCartButton>
    </div>
  );
}
