import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useVariantUrl} from '~/lib/variants';
import {ProductPrice} from './ProductPrice';
import styles from './CartLine.module.css';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLineType = OptimisticCartLine<CartApiQueryFragment>;

export type CartLineProps = {
  line: CartLineType;
  onNavigate?: () => void;
  className?: string;
};

/**
 * Single cart line — image, title, options, price, quantity controls.
 */
export function CartLine({line, onNavigate, className}: CartLineProps) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li className={[styles.root, className].filter(Boolean).join(' ')}>
      {image ? (
        <Link
          to={lineItemUrl}
          prefetch="intent"
          onClick={onNavigate}
          className={styles.media}
        >
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={96}
            loading="lazy"
            width={96}
            className={styles.image}
          />
        </Link>
      ) : (
        <div className={styles.mediaPlaceholder} aria-hidden="true" />
      )}

      <div className={styles.body}>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={onNavigate}
          className={styles.title}
        >
          {product.title}
        </Link>
        <ProductPrice price={line?.cost?.totalAmount} />
        {selectedOptions?.length ? (
          <ul className={styles.options}>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        ) : null}
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLineType}) {
  if (!line || typeof line.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className={styles.quantity}>
      <span className={styles.qtyLabel}>Qty {quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          type="submit"
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          className={styles.qtyBtn}
        >
          −
        </button>
      </CartLineUpdateButton>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          type="submit"
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
          className={styles.qtyBtn}
        >
          +
        </button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button type="submit" disabled={disabled} className={styles.remove}>
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
