import {Link, useNavigate} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import styles from './SizeSelector.module.css';

export type SizeSelectorProps = {
  option: MappedProductOptions;
  className?: string;
};

/**
 * Size option selector — text labels, clear selected/unavailable states.
 * No low-stock or urgency messaging.
 */
export function SizeSelector({option, className}: SizeSelectorProps) {
  const navigate = useNavigate();

  if (option.optionValues.length <= 1) return null;

  return (
    <fieldset
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <legend className={styles.legend}>
        <span>{option.name}</span>
        <LocaleAwareLink className={styles.guideLink} to="/size-guide">
          Size guide
        </LocaleAwareLink>
      </legend>
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
          } = value;

          const itemClass = [
            styles.item,
            selected ? styles.selected : '',
            exists && !available ? styles.soldOut : '',
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
                aria-label={`${option.name}: ${name}${!available ? ' (unavailable)' : ''}`}
              >
                {name}
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
              aria-label={`${option.name}: ${name}${exists && !available ? ' (unavailable)' : ''}`}
              onClick={() => {
                if (!selected) {
                  void navigate(`?${variantUriQuery}`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Heuristic: treat options named Size / Größe / Taille as size selectors. */
export function isSizeOptionName(name: string): boolean {
  return /^(size|größe|groesse|taille|talla|misura)$/i.test(name.trim());
}
