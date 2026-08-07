import styles from './SkipToContent.module.css';

type SkipToContentProps = {
  targetId?: string;
  label?: string;
};

/**
 * Accessibility skip link targeting the main content landmark.
 */
export function SkipToContent({
  targetId = 'main-content',
  label = 'Skip to content',
}: SkipToContentProps) {
  return (
    <a className={styles.link} href={`#${targetId}`}>
      {label}
    </a>
  );
}
