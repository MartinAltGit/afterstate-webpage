import styles from './TrustStrip.module.css';

type TrustItem = {
  id: string;
  title: string;
  detail: string;
};

const ITEMS: TrustItem[] = [
  {
    id: 'limited',
    title: 'Limited edition',
    detail: 'Short runs. No extras.',
  },
  {
    id: 'restock',
    title: 'No restocks',
    detail: 'When it’s gone, it’s gone.',
  },
  {
    id: 'make',
    title: 'Made to last',
    detail: 'Weight, fit, and finish first.',
  },
  {
    id: 'ship',
    title: 'UK & Europe',
    detail: 'Tracked from London.',
  },
];

function TrustSet({hidden}: {hidden?: boolean}) {
  return (
    <ul className={styles.set} aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item.id} className={styles.item}>
          <p className={styles.title}>{item.title}</p>
          <p className={styles.detail}>{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Quiet manifesto rail under the hero — type only.
 * Desktop: four-up. Mobile: one-line ticker so it stays a single row.
 */
export function TrustStrip({className}: {className?: string}) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Why Afterstate"
    >
      <div className={styles.rail}>
        <div className={styles.track}>
          <TrustSet />
          <TrustSet hidden />
        </div>
      </div>
    </section>
  );
}
