import type {FormEvent} from 'react';
import type {Route} from './+types/($locale).contact';
import {EditorialText} from '~/components/content/EditorialText';
import {PageContainer} from '~/components/layout/PageContainer';
import {buildMetaTags} from '~/components/seo';

const CONTACT_EMAIL = 'hello@afterstate.com';

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
    <PageContainer narrow>
      <EditorialText eyebrow="Afterstate" title="Contact">
        <p>
          Questions about fit, fabric, an order, or the brand — write us. We read
          every message and reply when we can give a clear answer.
        </p>
        <p>
          Prefer email directly?{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </EditorialText>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '1rem',
          maxWidth: '28rem',
          marginBlockEnd: '3rem',
        }}
        noValidate
      >
        <label>
          Name
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            style={{display: 'block', width: '100%', marginTop: '0.35rem'}}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            style={{display: 'block', width: '100%', marginTop: '0.35rem'}}
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            rows={6}
            required
            style={{display: 'block', width: '100%', marginTop: '0.35rem'}}
          />
        </label>
        <button type="submit">Send message</button>
        <p style={{fontSize: '0.875rem', opacity: 0.75}}>
          Opens your email client with a draft to {CONTACT_EMAIL}. No data is
          stored on this form.
        </p>
      </form>
    </PageContainer>
  );
}
