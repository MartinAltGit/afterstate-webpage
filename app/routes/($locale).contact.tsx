import type {FormEvent} from 'react';
import type {Route} from './+types/($locale).contact';
import heroContact from '~/assets/mockups/lookbook-03.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {PageHero} from '~/components/layout/PageHero';
import {Reveal} from '~/components/motion/Reveal';
import {buildMetaTags} from '~/components/seo';
import styles from '~/components/content/QuietPage.module.css';

const CONTACT_EMAIL = 'info@upvision.uk';

export const meta: Route.MetaFunction = () => {
  return buildMetaTags({
    title: 'Contact',
    description:
      'Write to Afterstate — sizing, orders, press, and quiet questions about the clothes.',
  });
};

export async function loader(_args: Route.LoaderArgs) {
  return null;
}

export default function ContactPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    const subject = encodeURIComponent(
      name ? `Afterstate — message from ${name}` : 'Afterstate — contact',
    );
    const body = encodeURIComponent(
      [`From: ${name || '—'}`, `Email: ${email || '—'}`, '', message].join('\n'),
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div className={styles.world}>
      <PageHero
        eyebrow="Contact"
        title="Write us"
        support="Fit, fabric, an order, or the brand — we reply when we can give a clear answer."
        imageSrc={heroContact}
        imageAlt="Afterstate lookbook detail"
      />

      <Reveal>
        <div className={styles.root}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Message</p>
            <p className={styles.note}>
              Prefer email?{' '}
              <a className={styles.mailLink} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Name</span>
              <input
                className={styles.fieldControl}
                type="text"
                name="name"
                autoComplete="name"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <input
                className={styles.fieldControl}
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Message</span>
              <textarea
                className={`${styles.fieldControl} ${styles.textarea}`}
                name="message"
                rows={6}
                required
              />
            </label>
            <button className={styles.submit} type="submit">
              Send message
            </button>
            <p className={styles.formNote}>
              Opens your email client with a draft to {CONTACT_EMAIL}. Nothing is
              stored on this form.
            </p>
          </form>

          <p className={styles.note}>
            <LocaleAwareLink prefetch="intent" to="/size-guide">
              Size guide
            </LocaleAwareLink>
            {' · '}
            <LocaleAwareLink prefetch="intent" to="/care">
              Care
            </LocaleAwareLink>
            {' · '}
            <LocaleAwareLink prefetch="intent" to="/about">
              About
            </LocaleAwareLink>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
