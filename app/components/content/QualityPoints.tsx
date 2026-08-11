import styles from './QualityPoints.module.css';

export type QualityPoint = {
  label: string;
  body: string;
};

export type QualityPointsProps = {
  eyebrow?: string;
  title?: string;
  points: QualityPoint[];
  className?: string;
};

/**
 * Editorial quality pillars — numbered points, not cards.
 */
export function QualityPoints({
  eyebrow = 'Standards',
  title = 'What we refuse to rush',
  points,
  className,
}: QualityPointsProps) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="quality-points-title"
    >
      <header className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 id="quality-points-title" className={styles.title}>
          {title}
        </h2>
      </header>
      <ol className={styles.list}>
        {points.map((point, index) => (
          <li key={point.label} className={styles.item}>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={styles.copy}>
              <h3 className={styles.label}>{point.label}</h3>
              <p className={styles.body}>{point.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
