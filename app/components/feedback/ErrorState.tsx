import type {ReactNode} from 'react';
import styles from './Feedback.module.css';

type ErrorStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not complete that request. Try again in a moment.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={[styles.state, className].filter(Boolean).join(' ')}
      role="alert"
    >
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
