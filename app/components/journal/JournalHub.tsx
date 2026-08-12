import heroAbout from '~/assets/mockups/lookbook-01.jpg';
import heroJournal from '~/assets/mockups/campaign-look-alt.jpg';
import heroBlog from '~/assets/mockups/lookbook-02.jpg';
import {LocaleAwareLink} from '~/components/navigation/LocaleAwareLink';
import {VisuallyHidden} from '~/components/primitives/VisuallyHidden';
import {JOURNAL_ESSAYS_PATH} from '~/lib/content-paths';
import styles from './JournalHub.module.css';

type HubTileId = 'journal' | 'about' | 'blog';

type HubTile = {
  id: HubTileId;
  to: string;
  eyebrow: string;
  title: string;
  support: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
};

const TILE_CLASS: Record<HubTileId, string> = {
  journal: styles.journal,
  about: styles.about,
  blog: styles.blog,
};

const TILES: HubTile[] = [
  {
    id: 'journal',
    to: JOURNAL_ESSAYS_PATH,
    eyebrow: 'Studio notes',
    title: 'Journal',
    support: 'Brand story, quality, and the quieter thinking behind the clothes.',
    cta: 'Enter',
    imageSrc: heroJournal,
    imageAlt: 'Model in Afterstate 001 No Rush campaign hoodie at dusk',
    priority: true,
  },
  {
    id: 'about',
    to: '/about',
    eyebrow: 'The brand',
    title: 'About',
    support: 'Clothes for the part of life that comes after the noise.',
    cta: 'Enter',
    imageSrc: heroAbout,
    imageAlt: 'Afterstate lookbook — quiet silhouette against soft light',
  },
  {
    id: 'blog',
    to: '/blog',
    eyebrow: 'Fashion world',
    title: 'Blog',
    support: 'Trends, stories, and culture — written for the wider fashion world.',
    cta: 'Enter',
    imageSrc: heroBlog,
    imageAlt: 'Editorial fashion imagery for the Afterstate blog',
    priority: true,
  },
];

/**
 * Journal world entrance — stacked Journal / About on the left, tall Blog on the right.
 */
export function JournalHub() {
  return (
    <div className={styles.world}>
      <VisuallyHidden as="h1">Journal</VisuallyHidden>
      <div className={styles.grid}>
        {TILES.map((tile) => (
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
