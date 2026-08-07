import styles from './Feedback.module.css';

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = 'Loading',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={[styles.state, className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <p className={styles.title}>{label}</p>
    </div>
  );
}
