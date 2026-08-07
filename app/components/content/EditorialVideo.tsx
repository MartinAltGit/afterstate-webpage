import styles from './EditorialVideo.module.css';

export type EditorialVideoProps = {
  src?: string | null;
  poster?: string | null;
  caption?: string;
  title?: string;
  fullBleed?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
};

/**
 * Editorial film / campaign video block with wireframe fallback.
 */
export function EditorialVideo({
  src,
  poster,
  caption = 'Afterstate 001 — campaign film',
  title = 'Afterstate campaign film',
  fullBleed = true,
  autoPlay = false,
  muted = true,
  loop = true,
  className,
}: EditorialVideoProps) {
  return (
    <section
      className={[
        styles.root,
        fullBleed ? styles.fullBleed : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <figure className={styles.figure}>
        <div className={styles.media}>
          {src ? (
            <video
              className={styles.video}
              src={src}
              poster={poster ?? undefined}
              title={title}
              controls
              playsInline
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className={styles.placeholder} role="img" aria-label={title}>
              Film placeholder
            </div>
          )}
        </div>
        {caption ? (
          <figcaption className={styles.caption}>{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}
