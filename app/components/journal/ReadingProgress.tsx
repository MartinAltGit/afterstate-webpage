import {useEffect, useState} from 'react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './ReadingProgress.module.css';

/**
 * Thin reading progress bar for journal essays.
 */
export function ReadingProgress() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const onScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      className={styles.root}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className={styles.bar}
        style={{transform: `scaleX(${progress})`}}
      />
    </div>
  );
}
