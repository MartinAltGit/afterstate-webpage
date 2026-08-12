import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useCartRoute} from '~/lib/cart-route';
import styles from './AddToCartButton.module.css';

export type AddToCartButtonProps = {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
};

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
}: AddToCartButtonProps) {
  const cartRoute = useCartRoute();

  return (
    <CartForm
      route={cartRoute}
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<unknown>) => {
        const busy = fetcher.state !== 'idle';
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics ?? null)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? busy}
              className={[styles.button, className].filter(Boolean).join(' ')}
              aria-busy={busy}
            >
              {children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
