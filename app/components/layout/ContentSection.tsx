import type {CSSProperties, ElementType, ReactNode} from 'react';
import styles from './ContentSection.module.css';

type ContentSectionProps = {
  as?: ElementType;
  id?: string;
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Page section with optional eyebrow and title.
 */
export function ContentSection({
  as: Component = 'section',
  id,
  eyebrow,
  title,
  children,
  className,
  style,
}: ContentSectionProps) {
  return (
    <Component
      id={id}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={style}
    >
      {(eyebrow || title) && (
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
        </header>
      )}
      {children}
    </Component>
  );
}
