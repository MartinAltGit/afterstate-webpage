import type {CSSProperties, ElementType, ReactNode} from 'react';
import styles from './Text.module.css';

type TextTone = 'default' | 'muted' | 'subtle';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type TextWeight = 'regular' | 'medium' | 'semibold';

type TextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: TextTone;
  size?: TextSize;
  weight?: TextWeight;
  style?: CSSProperties;
};

/**
 * Lightweight typography primitive for editorial wireframe layouts.
 */
export function Text({
  as: Component = 'p',
  children,
  className,
  tone = 'default',
  size = 'md',
  weight = 'regular',
  style,
}: TextProps) {
  const classes = [
    styles.root,
    styles[`tone-${tone}`],
    styles[`size-${size}`],
    styles[`weight-${weight}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
}
