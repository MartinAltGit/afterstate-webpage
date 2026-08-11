import markUrl from '~/assets/logo-afterstate.png';
import wordmarkUrl from '~/assets/logos/nav-wordmark.png';
import styles from './BrandLogo.module.css';

export type BrandLogoProps = {
  /** `mark` = AS symbol (masked). `wordmark` = outlined “after state” sticker. */
  variant?: 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  title?: string;
};

/**
 * Afterstate brand mark — symbol (mask) or horizontal sticker wordmark (image).
 */
export function BrandLogo({
  variant = 'mark',
  size = 'md',
  className,
  title = 'Afterstate',
}: BrandLogoProps) {
  const classes = [
    styles.root,
    variant === 'wordmark' ? styles.wordmark : styles.mark,
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'wordmark') {
    return (
      <img
        className={classes}
        src={wordmarkUrl}
        alt={title}
        title={title}
        width={320}
        height={120}
        decoding="async"
      />
    );
  }

  return (
    <span
      className={classes}
      role="img"
      aria-label={title}
      title={title}
      style={{
        WebkitMaskImage: `url(${markUrl})`,
        maskImage: `url(${markUrl})`,
      }}
    />
  );
}
