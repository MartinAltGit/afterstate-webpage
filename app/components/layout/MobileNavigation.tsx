import type {ReactNode} from 'react';
import {NavLink} from 'react-router';
import homeImage from '~/assets/mockups/hero-campaign.jpg';
import shopImage from '~/assets/mockups/hero-campaign-hoodies.jpg';
import limitedImage from '~/assets/mockups/campaign-look-new.jpg';
import journalImage from '~/assets/mockups/campaign-look-alt.jpg';
import {useAside} from '~/components/Aside';
import {SocialLinks} from '~/components/brand/SocialLinks';
import {LanguageSelector} from '~/components/commerce/LanguageSelector';
import {
  MAIN_NAV_ITEMS,
  type MainNavItem,
} from '~/components/layout/MainNavigation';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import styles from './MobileNavigation.module.css';

type DestinationMeta = {
  kicker: string;
  support: string;
  imageSrc: string;
};

const DESTINATION_META: Record<string, DestinationMeta> = {
  '/': {
    kicker: '01',
    support: 'Life beyond the rush.',
    imageSrc: homeImage,
  },
  '/shop': {
    kicker: '02',
    support: 'Clothes made to stay.',
    imageSrc: shopImage,
  },
  '/collections': {
    kicker: '03',
    support: 'Short runs. Clear intent.',
    imageSrc: limitedImage,
  },
  '/journal': {
    kicker: '04',
    support: 'Notes from the quieter side.',
    imageSrc: journalImage,
  },
};

type MobileNavigationProps = {
  items?: MainNavItem[];
  onNavigate?: () => void;
  className?: string;
  /** Kept for callers; sign-in row is hidden while accounts stay optional. */
  isLoggedIn?: Promise<boolean>;
  /** Kept for callers; language lives in LanguageSelector above the tiles. */
  marketSelector?: ReactNode;
};

/**
 * Full-height mobile navigation — destination tiles, then socials.
 */
export function MobileNavigation({
  items = MAIN_NAV_ITEMS,
  onNavigate,
  className,
}: MobileNavigationProps) {
  const localePrefix = useLocalePathPrefix();
  const {type} = useAside();
  const revealed = type === 'mobile';

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Mobile"
    >
      <div className={styles.top}>
        <LanguageSelector />
      </div>

      <ul className={styles.grid}>
        {items.map((item, index) => {
          const meta = DESTINATION_META[item.to];
          const kicker =
            meta?.kicker ?? String(index + 1).padStart(2, '0');

          return (
            <li key={item.to}>
              <NavLink
                className={({isActive}) =>
                  [
                    styles.tile,
                    meta ? null : styles.tilePlain,
                    isActive ? styles.active : null,
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
                end={item.to === '/'}
                onClick={onNavigate}
                prefetch="intent"
                to={prefixPathWithLocale(item.to, localePrefix)}
              >
                {meta && revealed ? (
                  <div className={styles.media} aria-hidden="true">
                    <img
                      className={styles.image}
                      src={meta.imageSrc}
                      alt=""
                      width={800}
                      height={1000}
                      decoding="async"
                    />
                    <span className={styles.veil} />
                    <span className={styles.grain} />
                  </div>
                ) : null}
                <span className={styles.copy}>
                  <span className={styles.kicker}>{kicker}</span>
                  <span className={styles.title}>{item.label}</span>
                  {meta ? (
                    <span className={styles.support}>{meta.support}</span>
                  ) : null}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className={styles.socialBar}>
        <SocialLinks onNavigate={onNavigate} />
      </div>
    </nav>
  );
}
