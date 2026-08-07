import type {ReactNode} from 'react';
import styles from './Feedback.module.css';

type FormErrorProps = {
  children?: ReactNode;
  errors?: string | string[] | null;
  className?: string;
};

export function FormError({children, errors, className}: FormErrorProps) {
  const list =
    typeof errors === 'string'
      ? [errors]
      : Array.isArray(errors)
        ? errors.filter(Boolean)
        : [];

  if (!children && !list.length) return null;

  return (
    <div
      className={[styles.formError, className].filter(Boolean).join(' ')}
      role="alert"
    >
      {children}
      {list.length ? (
        <ul className={styles.formErrorList}>
          {list.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
