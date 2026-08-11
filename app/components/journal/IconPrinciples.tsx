import {useId, useState} from 'react';
import {
  JOURNAL_ICON_MAP,
  type JournalIconName,
} from './JournalIcons';
import styles from './IconPrinciples.module.css';

export type IconPrinciple = {
  id: string;
  icon: JournalIconName;
  label: string;
  body: string;
};

export type IconPrinciplesProps = {
  eyebrow?: string;
  title?: string;
  principles: IconPrinciple[];
  className?: string;
};

/**
 * Interactive quality principles — select an icon row to expand detail.
 */
export function IconPrinciples({
  eyebrow = 'Standards',
  title = 'What we stand behind',
  principles,
  className,
}: IconPrinciplesProps) {
  const titleId = useId();
  const [active, setActive] = useState(principles[0]?.id ?? '');
  const current = principles.find((item) => item.id === active) ?? principles[0];

  if (!current) return null;

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <header className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
      </header>

      <div className={styles.layout}>
        <div className={styles.list} role="tablist" aria-label={title}>
          {principles.map((item) => {
            const Icon = JOURNAL_ICON_MAP[item.icon];
            const selected = item.id === current.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={[styles.item, selected ? styles.itemActive : null]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setActive(item.id)}
                onFocus={() => setActive(item.id)}
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.label}>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.detail} role="tabpanel" aria-live="polite">
          <span className={styles.detailIcon} aria-hidden="true">
            {(() => {
              const Icon = JOURNAL_ICON_MAP[current.icon];
              return <Icon />;
            })()}
          </span>
          <h3 className={styles.detailTitle}>{current.label}</h3>
          <p className={styles.detailBody}>{current.body}</p>
        </div>
      </div>
    </section>
  );
}
