import {BrandLogo} from '~/components/brand/BrandLogo';
import styles from './OpeningStatement.module.css';
import type {OpeningStatementSection, ClosingStatementSection} from './types';

type OpeningStatementProps = {
  section: OpeningStatementSection | ClosingStatementSection;
};

/**
 * Brand-first opening or closing statement for the Afterstate homepage.
 */
export function OpeningStatement({section}: OpeningStatementProps) {
  const tagline = section.tagline ?? 'Life beyond the rush.';
  const isClosing = section.type === 'closing_statement';

  return (
    <section
      className={styles.root}
      aria-label={isClosing ? 'Closing statement' : 'Opening statement'}
    >
      <div className={styles.inner}>
        <BrandLogo size="hero" className={styles.logo} />
        <p className={styles.tagline}>{tagline}</p>
        {section.body ? <p className={styles.body}>{section.body}</p> : null}
      </div>
    </section>
  );
}
