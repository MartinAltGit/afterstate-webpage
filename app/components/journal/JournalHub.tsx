import heroAbout from '~/assets/mockups/lookbook-01.jpg';
import heroJournal from '~/assets/mockups/campaign-look-alt.jpg';
import heroBlog from '~/assets/mockups/lookbook-02.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {VisuallyHidden} from '~/components/primitives/VisuallyHidden';
import {JOURNAL_ESSAYS_PATH} from '~/lib/content-paths';
import {useUiCopy} from '~/lib/ui-copy';
import styles from './JournalHub.module.css';

type HubTileId = 'journal' | 'about' | 'blog';

const TILE_CLASS: Record<HubTileId, string> = {
  journal: styles.journal,
  about: styles.about,
  blog: styles.blog,
};

const TILE_MEDIA: Record<
  HubTileId,
  {to: string; imageSrc: string; priority?: boolean}
> = {
  journal: {to: JOURNAL_ESSAYS_PATH, imageSrc: heroJournal, priority: true},
  about: {to: '/about', imageSrc: heroAbout},
  blog: {to: '/blog', imageSrc: heroBlog, priority: true},
};

/**
 * Journal world entrance — stacked Journal / About on the left, tall Blog on the right.
 */
export function JournalHub() {
  const copy = useUiCopy();
  const tiles: Array<{
    id: HubTileId;
    to: string;
    eyebrow: string;
    title: string;
    support: string;
    cta: string;
    imageSrc: string;
    imageAlt: string;
    priority?: boolean;
  }> = (
    ['journal', 'about', 'blog'] as const
  ).map((id) => ({
    id,
    to: TILE_MEDIA[id].to,
    imageSrc: TILE_MEDIA[id].imageSrc,
    priority: TILE_MEDIA[id].priority,
    cta: copy.hub.enter,
    ...copy.hub[id],
  }));

  return (
    <div className={styles.world}>
      <VisuallyHidden as="h1">{copy.hub.pageTitle}</VisuallyHidden>
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <LocaleAwareLink
            key={tile.id}
            className={[styles.tile, TILE_CLASS[tile.id]].join(' ')}
            prefetch="intent"
            to={tile.to}
            aria-label={`${tile.title}. ${tile.support}`}
          >
            <div className={styles.media} aria-hidden="true">
              <img
                className={styles.image}
                src={tile.imageSrc}
                alt=""
                width={2048}
                height={1152}
                decoding="async"
                fetchPriority={tile.priority ? 'high' : 'auto'}
                loading={tile.priority ? 'eager' : 'lazy'}
              />
              <div className={styles.veil} />
              <div className={styles.grain} />
            </div>
            <span className={styles.orbit} aria-hidden="true">
              <span className={styles.orbitGlow} />
            </span>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>{tile.eyebrow}</p>
              <h2 className={styles.title}>{tile.title}</h2>
              <p className={styles.support}>{tile.support}</p>
              <span className={styles.cta}>
                {tile.cta}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </span>
            </div>
          </LocaleAwareLink>
        ))}
      </div>
    </div>
  );
}
