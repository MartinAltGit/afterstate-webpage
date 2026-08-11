import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './Reveal.module.css';

export type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'li'
  | 'header'
  | 'figure'
  | 'footer'
  | 'ul'
  | 'nav';

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay after the element enters view */
  delayMs?: number;
  as?: RevealTag;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/**
 * Scroll-triggered fade/rise that replays every time the block
 * enters the viewport. SSR stays visible; motion arms after mount.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = 'div',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
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

    const narrow = window.matchMedia('(max-width: 44.99em)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(Boolean(entry?.isIntersecting));
      },
      {
        threshold: narrow ? 0.08 : 0.18,
        rootMargin: narrow ? '0px 0px -6% 0px' : '0px 0px -12% 0px',
      },
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
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Tag>
  );
}

export type RevealStaggerProps = {
  children: ReactNode;
  /** Delay step between successive children */
  staggerMs?: number;
  className?: string;
  as?: RevealTag;
  childAs?: RevealTag;
};

/**
 * Reveals each child in sequence as the group scrolls into view.
 */
export function RevealStagger({
  children,
  staggerMs = 95,
  className,
  as: Tag = 'div',
  childAs = 'div',
}: RevealStaggerProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <Reveal
          key={child.key ?? index}
          as={childAs}
          delayMs={Math.min(index, 10) * staggerMs}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
