import type {ReactNode} from 'react';
import {PageContainer} from '~/components/layout/PageContainer';
import styles from './AnnouncementBar.module.css';

type AnnouncementBarProps = {
  children?: ReactNode;
  message?: string;
  className?: string;
};

/**
 * Thin site-wide announcement strip. Renders nothing when empty.
 */
export function AnnouncementBar({
  children,
  message,
  className,
}: AnnouncementBarProps) {
  const content = children ?? message;
  if (!content) return null;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Announcement"
    >
      <PageContainer>
        <div className={styles.inner}>{content}</div>
      </PageContainer>
    </div>
  );
}
