import type {ReactNode} from 'react';
import styles from './EditorialText.module.css';

export type EditorialTextProps = {
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
};

/**
 * Centered or left editorial copy block for statements and introductions.
 */
export function EditorialText({
  eyebrow,
  title,
  children,
  align = 'start',
  className,
}: EditorialTextProps) {
  return (
    <section
      className={[
        styles.root,
        align === 'center' ? styles.alignCenter : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
    </section>
  );
}
