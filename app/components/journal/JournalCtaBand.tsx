import {MagneticLink} from '~/components/motion/MagneticLink';
import styles from './JournalCtaBand.module.css';

export type JournalCtaBandProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  className?: string;
};

/**
 * Night-stage CTA band — matches homepage magnetic buttons.
 */
export function JournalCtaBand({
  eyebrow = 'Next step',
  title = 'Wear the quieter hours',
  body = 'Limited editions. Short runs. No restocks. When you are ready, the drop is waiting.',
  primaryLabel = 'Shop Afterstate 001',
  primaryTo = '/afterstate-001-no-rush',
  secondaryLabel = 'Browse the shop',
  secondaryTo = '/shop',
  className,
}: JournalCtaBandProps) {
  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-labelledby="journal-cta-title"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 id="journal-cta-title" className={styles.title}>
            {title}
          </h2>
          {body ? <p className={styles.body}>{body}</p> : null}
        </div>
        <div className={styles.actions}>
          {primaryLabel && primaryTo ? (
            <MagneticLink to={primaryTo} variant="solid">
              {primaryLabel}
            </MagneticLink>
          ) : null}
          {secondaryLabel && secondaryTo ? (
            <MagneticLink to={secondaryTo} variant="ghost">
              {secondaryLabel}
            </MagneticLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
