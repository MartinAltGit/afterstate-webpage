import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './Reveal.module.css';

export type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'figure';
};

/**
 * Scroll-triggered fade/rise — one intentional entrance per block.
 * SSR stays visible; motion only arms after mount.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
    if (reduced) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0.16, rootMargin: '0px 0px -8% 0px'},
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const show = !mounted || visible || reduced;

  return (
    <Tag
      ref={ref as never}
      className={[styles.root, show ? styles.visible : styles.pending, className]
        .filter(Boolean)
        .join(' ')}
      style={{'--reveal-delay': `${delayMs}ms`} as CSSProperties}
    >
      {children}
    </Tag>
  );
}
