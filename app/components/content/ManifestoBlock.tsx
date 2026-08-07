import type {ReactNode} from 'react';
import styles from './ManifestoBlock.module.css';

export type ManifestoBlockProps = {
  label?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Editorial manifesto / collection philosophy block.
 */
export function ManifestoBlock({
  label = 'Manifesto',
  children,
  className,
}: ManifestoBlockProps) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={label}
    >
      {label ? <p className={styles.label}>{label}</p> : null}
      <div className={styles.body}>
        {children ?? (
          <>
            <p>
              Afterstate is for life beyond the rush — clothes designed without
              the pressure of trends or forced seasons.
            </p>
            <p>
              No Rush is the first statement: fewer pieces, clearer intent, and
              room to live in them.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
