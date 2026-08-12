import {CartForm} from '@shopify/hydrogen';
import {useEffect, useId, useState} from 'react';
import {useCartRoute} from '~/lib/cart-route';
import {isWelcomeDiscountCode} from '~/lib/welcomeOffer';
import styles from './DiscountForm.module.css';

export type CartDiscountCode = {
  code: string;
  applicable: boolean;
};

export type DiscountFormProps = {
  discountCodes?: CartDiscountCode[];
  className?: string;
};

/**
 * Cart discount field.
 * Keeps codes on the cart even when Shopify marks them not-yet-applicable
 * (common for first-order codes before checkout email). Does not auto-purge.
 */
export function DiscountForm({
  discountCodes = [],
  className,
}: DiscountFormProps) {
  const inputId = useId();
  const errorId = useId();
  const cartRoute = useCartRoute();

  const codesOnCart = discountCodes.map(({code}) => code);
  const applicableCodes = discountCodes
    .filter((discount) => discount.applicable)
    .map(({code}) => code);
  const pendingCodes = discountCodes
    .filter((discount) => !discount.applicable)
    .map(({code}) => code);

  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // After a manual apply, surface a clear message if Shopify rejected it.
  useEffect(() => {
    if (!submittedCode) return;

    const match = discountCodes.find(
      (discount) =>
        discount.code.toLowerCase() === submittedCode.toLowerCase(),
    );

    if (!match) {
      setError(
        'That code wasn’t accepted. For local testing, create Welcome20 in Shopify Admin → Discounts.',
      );
      return;
    }

    if (!match.applicable) {
      const isWelcome = isWelcomeDiscountCode(match.code);
      setError(
        isWelcome
          ? null
          : 'Code saved, but it isn’t active on this cart yet. It may apply at checkout.',
      );
      if (isWelcome) {
        setSubmittedCode(null);
        setDraft('');
      }
      return;
    }

    setError(null);
    setSubmittedCode(null);
    setDraft('');
  }, [discountCodes, submittedCode]);

  if (codesOnCart.length > 0) {
    const hasWelcome = codesOnCart.some(isWelcomeDiscountCode);
    const allApplicable = pendingCodes.length === 0 || hasWelcome;

    return (
      <section
        className={[styles.root, className].filter(Boolean).join(' ')}
        aria-label="Discount"
      >
        <CartForm
          route={cartRoute}
          action={CartForm.ACTIONS.DiscountCodesUpdate}
          inputs={{discountCodes: []}}
        >
          <div className={styles.applied}>
            <div className={styles.appliedCopy}>
              <span className={styles.appliedLabel}>
                {allApplicable ? 'Code applied' : 'Code on cart'}
              </span>
              <span className={styles.appliedCode}>
                {codesOnCart.join(', ')}
              </span>
              {!allApplicable ? (
                <span className={styles.appliedHint}>
                  Discount confirms when eligible (often at checkout)
                </span>
              ) : null}
            </div>
            <button type="submit" className={styles.remove}>
              Remove
            </button>
          </div>
        </CartForm>
      </section>
    );
  }

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Discount"
    >
      <CartForm
        route={cartRoute}
        action={CartForm.ACTIONS.DiscountCodesUpdate}
        inputs={{discountCodes: applicableCodes}}
      >
        {(fetcher) => {
          const busy = fetcher.state !== 'idle';

          return (
            <div className={styles.field}>
              <label htmlFor={inputId} className={styles.label}>
                Promo code
              </label>
              <div
                className={[styles.control, error ? styles.controlError : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  id={inputId}
                  type="text"
                  name="discountCode"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (error) setError(null);
                    if (submittedCode) setSubmittedCode(null);
                  }}
                  placeholder="Enter code"
                  className={styles.input}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={busy}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                />
                <button
                  type="submit"
                  className={styles.apply}
                  disabled={busy || !draft.trim()}
                  onClick={() => {
                    const next = draft.trim();
                    if (next) setSubmittedCode(next);
                  }}
                >
                  {busy ? '…' : 'Apply'}
                </button>
              </div>
              <p
                id={errorId}
                className={error ? styles.error : styles.hint}
                role={error ? 'alert' : undefined}
              >
                {error ?? '\u00a0'}
              </p>
            </div>
          );
        }}
      </CartForm>
    </section>
  );
}
