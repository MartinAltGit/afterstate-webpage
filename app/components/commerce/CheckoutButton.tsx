import styles from './CheckoutButton.module.css';

export type CheckoutButtonProps = {
  checkoutUrl?: string | null;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Links to Shopify checkout via cart.checkoutUrl.
 */
export function CheckoutButton({
  checkoutUrl,
  children = 'Checkout',
  className,
}: CheckoutButtonProps) {
  if (!checkoutUrl) {
    return (
      <p className={[styles.unavailable, className].filter(Boolean).join(' ')} role="status">
        Checkout isn’t available right now. Refresh the page and try again.
      </p>
    );
  }

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className={[styles.button, className].filter(Boolean).join(' ')}
    >
      <span className={styles.label}>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}
