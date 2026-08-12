import {useRef, type MouseEvent, type ReactNode} from 'react';
import {Link} from 'react-router';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './MagneticLink.module.css';

export type MagneticLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  prefetch?: 'intent' | 'render' | 'none' | 'viewport';
  strength?: number;
  variant?: 'solid' | 'ghost' | 'outline' | 'bright';
};

/**
 * CTA that gently follows the pointer — premium, not playful.
 */
export function MagneticLink({
  to,
  children,
  className,
  prefetch = 'intent',
  strength = 0.28,
  variant = 'solid',
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <Link
      ref={ref}
      to={to}
      prefetch={prefetch}
      className={[
        styles.root,
        variant === 'ghost' ? styles.ghost : null,
        variant === 'outline' ? styles.outline : null,
        variant === 'bright' ? styles.bright : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span className={styles.label}>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
