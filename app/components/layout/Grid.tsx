import type {CSSProperties, ElementType, ReactNode} from 'react';
import styles from './Grid.module.css';

type GridProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
  style?: CSSProperties;
};

/**
 * Simple responsive content grid.
 */
export function Grid({
  as: Component = 'div',
  children,
  className,
  columns = 3,
  style,
}: GridProps) {
  return (
    <Component
      className={[
        styles.root,
        styles[`cols-${columns}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </Component>
  );
}
