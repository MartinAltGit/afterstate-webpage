import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useCartRoute} from '~/lib/cart-route';
import {useVariantUrl} from '~/lib/variants';
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
  const optionSummary = formatSelectedOptions(selectedOptions);
  const linePrice = getLinePrice(line);

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
            height={144}
            loading="lazy"
            width={144}
            className={styles.image}
            sizes="(min-width: 48em) 128px, 104px"
          />
        </Link>
      ) : (
        <div className={styles.mediaPlaceholder} aria-hidden="true" />
      )}

      <div className={styles.body}>
        <div className={styles.header}>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={onNavigate}
            className={styles.title}
          >
            {product.title}
          </Link>
          {linePrice ? (
            <span className={styles.pricePair}>
              <Money data={linePrice.current} className={styles.price} />
              {linePrice.compare ? (
                <s className={styles.compare}>
                  <Money data={linePrice.compare} />
                </s>
              ) : null}
            </span>
          ) : null}
        </div>

        {optionSummary ? (
          <p className={styles.options}>{optionSummary}</p>
        ) : null}

        <div className={styles.actions}>
          <CartLineQuantity line={line} />
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>
      </div>
    </li>
  );
}

function getLinePrice(line: CartLineType) {
  const current = line?.cost?.totalAmount;
  if (!current?.amount) return null;

  const discountAmount = (line.discountAllocations ?? []).reduce(
    (sum, allocation) => sum + Number(allocation.discountedAmount?.amount ?? 0),
    0,
  );

  const subtotal = line.cost?.subtotalAmount;
  const compareFromSubtotal =
    subtotal?.amount && Number(subtotal.amount) > Number(current.amount)
      ? subtotal
      : null;

  const compareFromUnit =
    line.cost?.amountPerQuantity?.amount && line.quantity
      ? {
          amount: (
            Number(line.cost.amountPerQuantity.amount) * line.quantity
          ).toFixed(2),
          currencyCode: line.cost.amountPerQuantity.currencyCode,
        }
      : null;

  const compareCandidate =
    compareFromSubtotal ||
    (compareFromUnit &&
    Number(compareFromUnit.amount) > Number(current.amount)
      ? compareFromUnit
      : null);

  // Prefer Shopify line totals; also strike through when an allocation reduced the line.
  const compare =
    compareCandidate ||
    (discountAmount > 0 && compareFromUnit ? compareFromUnit : null);

  return {current, compare};
}

function formatSelectedOptions(
  selectedOptions: CartLineType['merchandise']['selectedOptions'] | undefined,
) {
  if (!selectedOptions?.length) return null;

  const values = selectedOptions
    .filter(
      (option) =>
        option.value &&
        option.value.toLowerCase() !== 'default title' &&
        option.name?.toLowerCase() !== 'title',
    )
    .map((option) => option.value);

  if (!values.length) return null;
  return values.join(' · ');
}

function CartLineQuantity({line}: {line: CartLineType}) {
  if (!line || typeof line.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className={styles.stepper} role="group" aria-label="Quantity">
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
      <span className={styles.qtyValue} aria-live="polite">
        {quantity}
      </span>
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
  const cartRoute = useCartRoute();

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route={cartRoute}
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
  const cartRoute = useCartRoute();
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route={cartRoute}
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
