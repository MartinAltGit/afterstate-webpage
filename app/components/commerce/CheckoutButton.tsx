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
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className={[styles.button, className].filter(Boolean).join(' ')}
    >
      {children}
    </a>
  );
}
