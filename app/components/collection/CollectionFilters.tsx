import {useId} from 'react';
import styles from './CollectionFilters.module.css';

export type CollectionSortValue =
  | 'manual'
  | 'best-selling'
  | 'title-asc'
  | 'title-desc'
  | 'price-asc'
  | 'price-desc'
  | 'created-desc';

export type CollectionFilterOption = {
  id: string;
  label: string;
  count?: number;
};

export type CollectionFiltersProps = {
  sort?: CollectionSortValue;
  onSortChange?: (value: CollectionSortValue) => void;
  /** Basic availability filter */
  availableOnly?: boolean;
  onAvailableOnlyChange?: (value: boolean) => void;
  /** Optional product-type / tag filters (UI structure only) */
  filterGroups?: Array<{
    id: string;
    label: string;
    options: CollectionFilterOption[];
    selectedIds?: string[];
    onChange?: (ids: string[]) => void;
  }>;
  className?: string;
};

const SORT_OPTIONS: Array<{value: CollectionSortValue; label: string}> = [
  {value: 'manual', label: 'Featured'},
  {value: 'best-selling', label: 'Best selling'},
  {value: 'title-asc', label: 'Title A–Z'},
  {value: 'title-desc', label: 'Title Z–A'},
  {value: 'price-asc', label: 'Price: low to high'},
  {value: 'price-desc', label: 'Price: high to low'},
  {value: 'created-desc', label: 'Newest'},
];

/**
 * Basic sort / filter UI structure for collections.
 * Wire up to route search params in the parent.
 */
export function CollectionFilters({
  sort = 'manual',
  onSortChange,
  availableOnly = false,
  onAvailableOnlyChange,
  filterGroups = [],
  className,
}: CollectionFiltersProps) {
  const sortId = useId();
  const availId = useId();

  return (
    <form
      className={[styles.root, className].filter(Boolean).join(' ')}
      onSubmit={(e) => e.preventDefault()}
      aria-label="Collection filters"
    >
      <div className={styles.group}>
        <label htmlFor={sortId} className={styles.label}>
          Sort
        </label>
        <select
          id={sortId}
          className={styles.select}
          value={sort}
          onChange={(e) =>
            onSortChange?.(e.target.value as CollectionSortValue)
          }
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor={availId} className={styles.checkLabel}>
          <input
            id={availId}
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange?.(e.target.checked)}
            className={styles.checkbox}
          />
          In stock only
        </label>
      </div>

      {filterGroups.map((group) => (
        <fieldset key={group.id} className={styles.fieldset}>
          <legend className={styles.label}>{group.label}</legend>
          <ul className={styles.options}>
            {group.options.map((option) => {
              const selected = group.selectedIds?.includes(option.id) ?? false;
              return (
                <li key={option.id}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selected}
                      onChange={() => {
                        const current = group.selectedIds ?? [];
                        const next = selected
                          ? current.filter((id) => id !== option.id)
                          : [...current, option.id];
                        group.onChange?.(next);
                      }}
                    />
                    <span>
                      {option.label}
                      {typeof option.count === 'number'
                        ? ` (${option.count})`
                        : ''}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </form>
  );
}
