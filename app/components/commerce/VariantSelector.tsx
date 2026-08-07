import {Link, useNavigate} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import styles from './VariantSelector.module.css';

export type VariantSelectorProps = {
  option: MappedProductOptions;
  className?: string;
};

/**
 * Non-size product option selector (color, etc.).
 * Uses Link for combined-listing children; buttons + navigate for same-product options.
 */
export function VariantSelector({option, className}: VariantSelectorProps) {
  const navigate = useNavigate();

  if (option.optionValues.length <= 1) return null;

  return (
    <fieldset
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <legend className={styles.legend}>{option.name}</legend>
      <div className={styles.grid}>
        {option.optionValues.map((value) => {
          const {
            name,
            handle,
            variantUriQuery,
            selected,
            available,
            exists,
            isDifferentProduct,
            swatch,
          } = value;

          const itemClass = [
            styles.item,
            selected ? styles.selected : '',
            !available ? styles.unavailable : '',
          ]
            .filter(Boolean)
            .join(' ');

          if (isDifferentProduct) {
            return (
              <Link
                key={`${option.name}-${name}`}
                className={itemClass}
                prefetch="intent"
                preventScrollReset
                replace
                to={`/products/${handle}?${variantUriQuery}`}
                aria-label={`${option.name}: ${name}`}
              >
                <OptionSwatch swatch={swatch} name={name} />
              </Link>
            );
          }

          return (
            <button
              key={`${option.name}-${name}`}
              type="button"
              className={itemClass}
              disabled={!exists}
              aria-pressed={selected}
              aria-label={`${option.name}: ${name}`}
              onClick={() => {
                if (!selected) {
                  void navigate(`?${variantUriQuery}`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }
              }}
            >
              <OptionSwatch swatch={swatch} name={name} />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function OptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span className={styles.label}>{name}</span>;
  }

  return (
    <span
      className={styles.swatch}
      style={{backgroundColor: color || 'transparent'}}
      title={name}
    >
      {image ? <img src={image} alt="" /> : null}
      <span className={styles.srOnly}>{name}</span>
    </span>
  );
}
