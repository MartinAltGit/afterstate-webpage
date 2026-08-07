import type {FormEvent} from 'react';
import styles from './NewsletterForm.module.css';

export type NewsletterFormProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  note?: string;
  onSubmit?: (email: string) => void | Promise<void>;
  className?: string;
};

/**
 * Newsletter signup — wireframe form for Afterstate updates.
 * Consent-aware tracking can be wired via analytics later.
 */
export function NewsletterForm({
  eyebrow = 'Stay close',
  title = 'Afterstate notes',
  description = 'Campaign drops, journal pieces, and quiet updates — no noise.',
  placeholder = 'Email address',
  submitLabel = 'Subscribe',
  note = 'By subscribing you agree to Afterstate privacy terms.',
  onSubmit,
  className,
}: NewsletterFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    if (!email) return;
    void onSubmit?.(email);
  }

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="newsletter-title"
    >
      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 id="newsletter-title" className={styles.title}>
          {title}
        </h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor="afterstate-newsletter-email">
            Email
          </label>
          <input
            id="afterstate-newsletter-email"
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={placeholder}
          />
          <button type="submit" className={styles.submit}>
            {submitLabel}
          </button>
        </form>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  );
}
