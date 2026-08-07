import type {ReactNode} from 'react';
import styles from './Feedback.module.css';

type SoldOutStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
};

export function SoldOutState({
  title = 'Sold out',
  message = 'This piece from Afterstate 001 is no longer available.',
  action,
  className,
}: SoldOutStateProps) {
  return (
    <div className={[styles.state, className].filter(Boolean).join(' ')}>
      <p className={styles.eyebrow}>Unavailable</p>
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
