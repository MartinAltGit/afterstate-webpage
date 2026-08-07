import type {ReactNode} from 'react';
import styles from './Feedback.module.css';

type NotFoundStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
};

export function NotFoundState({
  title = 'Page not found',
  message = 'This Afterstate page does not exist or has moved.',
  action,
  className,
}: NotFoundStateProps) {
  return (
    <div className={[styles.state, className].filter(Boolean).join(' ')}>
      <p className={styles.eyebrow}>404</p>
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
