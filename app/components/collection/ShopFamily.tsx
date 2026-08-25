import {ShopPieceCard} from '~/components/commerce/ShopPieceCard';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import {
  getFamilyPieces,
  type ShopDesignFamily,
  type ShopFormFilter,
} from '~/lib/shop-catalog';
import styles from './ShopFamily.module.css';

export type ShopFamilyProps = {
  family: ShopDesignFamily<CollectionGridProduct>;
  index: number;
  preferredForm?: ShopFormFilter;
};

/**
 * One design as a framed product grid — overlay names, real view buttons.
 */
export function ShopFamily({
  family,
  index,
  preferredForm = 'all',
}: ShopFamilyProps) {
  const pieces = getFamilyPieces(family, preferredForm);
  const number = String(index + 1).padStart(2, '0');
  const formNames = family.forms
    .filter((entry) =>
      preferredForm === 'all' ? true : entry.id === preferredForm,
    )
    .map((entry) => entry.label)
    .join(' · ');

  return (
    <article
      id={`design-${family.id}`}
      className={styles.chapter}
      aria-labelledby={`design-${family.id}-title`}
    >
      <header className={styles.header}>
        <div className={styles.heading}>
          <p className={styles.index} aria-hidden="true">
            {number}
          </p>
          <div>
            <h2 id={`design-${family.id}-title`} className={styles.name}>
              {family.name}
            </h2>
            {formNames ? <p className={styles.forms}>{formNames}</p> : null}
          </div>
        </div>
        <p className={styles.count}>
          {pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'}
        </p>
      </header>

      {pieces.length === 0 ? (
        <p className={styles.empty}>Not in this object yet.</p>
      ) : (
        <ul className={styles.pieces}>
          {pieces.map((product, pieceIndex) => (
            <li key={product.id}>
              <ShopPieceCard product={product} lead={pieceIndex === 0} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
