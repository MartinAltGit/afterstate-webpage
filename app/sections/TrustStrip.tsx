import {useUiCopy} from '~/lib/ui-copy';
import styles from './TrustStrip.module.css';

function TrustSet({
  items,
  hidden,
}: {
  items: Array<{id: string; title: string; detail: string}>;
  hidden?: boolean;
}) {
  return (
    <ul className={styles.set} aria-hidden={hidden || undefined}>
      {items.map((item) => (
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
  const copy = useUiCopy();

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={copy.trust.aria}
    >
      <div className={styles.rail}>
        <div className={styles.track}>
          <TrustSet items={copy.trust.items} />
          <TrustSet items={copy.trust.items} hidden />
        </div>
      </div>
    </section>
  );
}
