import type {CSSProperties, ElementType, ReactNode} from 'react';
import styles from './Stack.module.css';

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type StackProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  gap?: StackGap;
  style?: CSSProperties;
};

/**
 * Vertical stack with consistent spacing.
 */
export function Stack({
  as: Component = 'div',
  children,
  className,
  gap = 'md',
  style,
}: StackProps) {
  return (
    <Component
      className={[styles.root, styles[`gap-${gap}`], className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </Component>
  );
}
