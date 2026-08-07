import type {ReactNode} from 'react';
import styles from './Feedback.module.css';

type EmptyStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Check back when Afterstate drops the next piece.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={[styles.state, className].filter(Boolean).join(' ')}>
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
