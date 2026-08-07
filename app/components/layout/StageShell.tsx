import type {ReactNode} from 'react';
import styles from './StageShell.module.css';

type StageShellProps = {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
};

/**
 * Atmospheric margins + centered content stage.
 * Optional header floats above the stage in the top middle.
 */
export function StageShell({children, header, className}: StageShellProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {header ? <div className={styles.headerSlot}>{header}</div> : null}
      <div className={styles.stage}>{children}</div>
    </div>
  );
}
