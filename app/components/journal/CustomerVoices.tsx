import {useEffect, useId, useState} from 'react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {IconVoice} from './JournalIcons';
import styles from './CustomerVoices.module.css';

export type CustomerVoice = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  city?: string;
};

export type CustomerVoicesProps = {
  eyebrow?: string;
  title?: string;
  voices?: CustomerVoice[];
  className?: string;
};

const DEFAULT_VOICES: CustomerVoice[] = [
  {
    id: 'lena',
    quote:
      'I bought one hoodie and stopped refreshing drops. It still looks decided after a winter of trains and rain.',
    name: 'Lena M.',
    detail: 'No Rush hoodie · owned 7 months',
    city: 'Lisbon',
  },
  {
    id: 'jonas',
    quote:
      'The weight surprised me first — then the quiet. No loud branding, just cloth that holds its shape.',
    name: 'Jonas K.',
    detail: '001 fleece · owned 4 months',
    city: 'Berlin',
  },
  {
    id: 'mira',
    quote:
      'I like that it sold out and stayed sold out. Feels like the brand meant the limited part.',
    name: 'Mira S.',
    detail: 'Campaign tee · owned 5 months',
    city: 'Copenhagen',
  },
  {
    id: 'adrian',
    quote:
      'Morning decisions got easier. Same silhouette, different days. That is the Afterstate trick.',
    name: 'Adrian P.',
    detail: 'Cap + hoodie set · owned 3 months',
    city: 'Barcelona',
  },
];

/**
 * Interactive customer voices — click names or cycle with controls.
 */
export function CustomerVoices({
  eyebrow = 'Worn in',
  title = 'What customers say',
  voices = DEFAULT_VOICES,
  className,
}: CustomerVoicesProps) {
  const labelId = useId();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = voices[active] ?? voices[0];

  useEffect(() => {
    if (reduced || paused || voices.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % voices.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused, reduced, voices.length]);

  if (!current) return null;

  const go = (next: number) => {
    setActive((next + voices.length) % voices.length);
  };

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            <IconVoice />
          </span>
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2 id={labelId} className={styles.title}>
              {title}
            </h2>
          </div>
        </header>

        <figure className={styles.figure} aria-live="polite">
          <blockquote className={styles.quote}>
            <p>“{current.quote}”</p>
          </blockquote>
          <figcaption className={styles.caption}>
            <span className={styles.name}>{current.name}</span>
            <span className={styles.meta}>
              {current.detail}
              {current.city ? ` · ${current.city}` : ''}
            </span>
          </figcaption>
        </figure>

        <div className={styles.controls}>
          <div className={styles.tabs} role="tablist" aria-label="Customer voices">
            {voices.map((voice, index) => (
              <button
                key={voice.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={[
                  styles.tab,
                  index === active ? styles.tabActive : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActive(index)}
              >
                {voice.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Previous voice"
              onClick={() => go(active - 1)}
            >
              ←
            </button>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Next voice"
              onClick={() => go(active + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
