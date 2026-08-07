import type {CSSProperties, ElementType, ReactNode} from 'react';
import styles from './PageContainer.module.css';

type PageContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  style?: CSSProperties;
};

/**
 * Horizontal max-width wrapper for page content.
 */
export function PageContainer({
  as: Component = 'div',
  children,
  className,
  narrow = false,
  style,
}: PageContainerProps) {
  return (
    <Component
      className={[
        styles.root,
        narrow ? styles.narrow : null,
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
