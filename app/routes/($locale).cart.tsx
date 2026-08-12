import {
  useLoaderData,
  data,
  type HeadersFunction,
} from 'react-router';
import type {Route} from './+types/($locale).cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm, useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLine} from '~/components/commerce/CartLine';
import {CartSummary} from '~/components/commerce/CartSummary';
import {EmptyState} from '~/components/feedback/EmptyState';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageContainer} from '~/components/layout/PageContainer';
import {Breadcrumbs} from '~/components/navigation/Breadcrumbs';
import {buildPageTitle} from '~/components/seo';

export const meta: Route.MetaFunction = () => {
  return [{title: buildPageTitle('Cart')}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const rawCode = inputs.discountCode;
      const formDiscountCode =
        typeof rawCode === 'string' ? rawCode.trim() : '';

      const existingCodes = Array.isArray(inputs.discountCodes)
        ? inputs.discountCodes.filter(
            (code): code is string => typeof code === 'string',
          )
        : [];

      // User inputted discount code + codes already applied on cart
      const discountCodes = [
        ...(formDiscountCode ? [formDiscountCode] : []),
        ...existingCodes,
      ];

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const originalCart = useLoaderData<typeof loader>();
  const cart = useOptimisticCart(
    (originalCart ?? null) as CartApiQueryFragment | null,
  );
  const lines = cart?.lines?.nodes ?? [];
  const hasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);

  const parentLines = lines.filter(
    (line) =>
      !(
        'parentRelationship' in line &&
        line.parentRelationship?.parent
      ),
  );

  return (
    <PageContainer as="div" className="cart-page">
      <Breadcrumbs items={[{label: 'Home', to: '/'}, {label: 'Cart'}]} />
      <h1>Cart</h1>

      {!hasItems ? (
        <EmptyState
          title="Your cart is empty"
          message="When you find something that fits the pace, it will land here."
          action={
            <LocaleAwareLink to="/shop" prefetch="intent">
              Continue shopping
            </LocaleAwareLink>
          }
        />
      ) : (
        <div className="cart-page-layout">
          <ul className="cart-page-lines" aria-label="Cart lines">
            {parentLines.map((line) => (
              <CartLine key={line.id} line={line} />
            ))}
          </ul>
          <CartSummary cart={cart} />
        </div>
      )}
    </PageContainer>
  );
}
