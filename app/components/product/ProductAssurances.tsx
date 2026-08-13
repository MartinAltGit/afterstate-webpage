import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import styles from './ProductAssurances.module.css';

export type ProductAssurancesProps = {
  shippingNote?: string | null;
  className?: string;
};

function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        d="M3 7.5h11.5V16H3zM14.5 10.5H19l2 3V16h-6.5zM7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
      />
    </svg>
  );
}

function IconReturn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        d="M7 8.5H4.5L7 6M4.5 8.5H14a5 5 0 1 1 0 10H8"
      />
    </svg>
  );
}

function IconFit() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        d="M4 8h16M4 16h16M8 4v4M16 4v4M8 16v4M16 16v4"
      />
    </svg>
  );
}

/**
 * Compact trust row under add-to-cart.
 */
export function ProductAssurances({
  shippingNote,
  className,
}: ProductAssurancesProps) {
  const delivery =
    shippingNote?.trim() || 'UK 2–5 days · EU 3–10';

  return (
    <ul
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Delivery and returns"
    >
      <li>
        <LocaleAwareLink className={styles.item} prefetch="intent" to="/shipping-returns">
          <IconTruck />
          <span>
            <strong>Delivery</strong>
            {delivery}
          </span>
        </LocaleAwareLink>
      </li>
      <li>
        <LocaleAwareLink className={styles.item} prefetch="intent" to="/shipping-returns">
          <IconReturn />
          <span>
            <strong>Returns</strong>
            14 days, tags on
          </span>
        </LocaleAwareLink>
      </li>
      <li>
        <LocaleAwareLink className={styles.item} prefetch="intent" to="/size-guide">
          <IconFit />
          <span>
            <strong>Fit</strong>
            Size guide
          </span>
        </LocaleAwareLink>
      </li>
    </ul>
  );
}
