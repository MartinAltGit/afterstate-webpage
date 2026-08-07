import styles from './QuoteBlock.module.css';

export type QuoteBlockProps = {
  quote?: string;
  attribution?: string;
  className?: string;
};

/**
 * Pull-quote for campaign and journal editorial moments.
 */
export function QuoteBlock({
  quote = 'Life beyond the rush.',
  attribution = 'Afterstate',
  className,
}: QuoteBlockProps) {
  return (
    <section className={[styles.root, className].filter(Boolean).join(' ')}>
      <blockquote className={styles.inner}>
        <p className={styles.quote}>{quote}</p>
        {attribution ? (
          <footer className={styles.attribution}>{attribution}</footer>
        ) : null}
      </blockquote>
    </section>
  );
}
