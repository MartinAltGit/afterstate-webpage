import {Link, useNavigate} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {guessSwatchColor, isColorOptionName} from '~/lib/swatch';
import styles from './VariantSelector.module.css';

export type VariantSelectorProps = {
  option: MappedProductOptions;
  className?: string;
};

/**
 * Colour / non-size options — swatch + name, never a filled form chip.
 */
export function VariantSelector({option, className}: VariantSelectorProps) {
  const navigate = useNavigate();
  const selected = option.optionValues.find((value) => value.selected);
  const values = option.optionValues;
  if (!values.length) return null;

  const single = values.length === 1;
  const asColor = isColorOptionName(option.name);

  return (
    <fieldset className={[styles.root, className].filter(Boolean).join(' ')}>
      <legend className={styles.legend}>
        <span>{option.name}</span>
        {selected && !single ? (
          <span className={styles.chosen}>{selected.name}</span>
        ) : null}
      </legend>

      {single ? (
        <div className={styles.current}>
          <OptionSwatch swatch={values[0].swatch} name={values[0].name} />
          <span className={styles.currentName}>{values[0].name}</span>
        </div>
      ) : (
        <div className={asColor ? styles.swatchRow : styles.grid}>
          {values.map((value) => {
            const {
              name,
              handle,
              variantUriQuery,
              selected: isSelected,
              available,
              exists,
              isDifferentProduct,
              swatch,
            } = value;

            const itemClass = [
              asColor ? styles.swatchItem : styles.item,
              isSelected ? styles.selected : '',
              !available ? styles.unavailable : '',
            ]
              .filter(Boolean)
              .join(' ');

            const inner = (
              <OptionSwatch swatch={swatch} name={name} named={!asColor} />
            );

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
                  {inner}
                </Link>
              );
            }

            return (
              <button
                key={`${option.name}-${name}`}
                type="button"
                className={itemClass}
                disabled={!exists}
                aria-pressed={isSelected}
                aria-label={`${option.name}: ${name}`}
                onClick={() => {
                  if (!isSelected) {
                    void navigate(`?${variantUriQuery}`, {
                      replace: true,
                      preventScrollReset: true,
                    });
                  }
                }}
              >
                {inner}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

function OptionSwatch({
  swatch,
  name,
  named = false,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  named?: boolean;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color || guessSwatchColor(name);

  if (!image && !color) {
    if (named) return <span className={styles.label}>{name}</span>;
    return (
      <span
        className={styles.swatch}
        style={{backgroundColor: 'rgba(236, 231, 218, 0.16)'}}
        title={name}
      >
        <span className={styles.srOnly}>{name}</span>
      </span>
    );
  }

  return (
    <span className={named ? styles.named : undefined}>
      <span
        className={styles.swatch}
        style={{backgroundColor: color || 'transparent'}}
        title={name}
      >
        {image ? <img src={image} alt="" /> : null}
        <span className={styles.srOnly}>{name}</span>
      </span>
      {named ? <span className={styles.currentName}>{name}</span> : null}
    </span>
  );
}
