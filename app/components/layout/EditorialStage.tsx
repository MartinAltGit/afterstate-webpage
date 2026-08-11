import type {ReactNode} from 'react';
import styles from './EditorialStage.module.css';

export type EditorialStageProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Dark night stage wrapper — scopes shared commerce/content cards into the
 * homepage Afterhours palette (bone type, brass focus, raised mist surfaces).
 */
export function EditorialStage({children, className}: EditorialStageProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
