import type {ReactNode} from 'react';
import styles from './VisuallyHidden.module.css';

type VisuallyHiddenProps = {
  children: ReactNode;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
};

/**
 * Visually hides content while keeping it available to assistive technology.
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
}: VisuallyHiddenProps) {
  return <Component className={styles.root}>{children}</Component>;
}
