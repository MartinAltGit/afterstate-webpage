import {Link, useLocation} from 'react-router';
import {replaceLocaleInPath} from '~/lib/locale-path';
import styles from './MarketSelector.module.css';

export type MarketLocale = {
  /** Full market label, e.g. EN-GB */
  label: string;
  /** Short code shown in the UI (region for EN markets, language otherwise) */
  code: string;
  /** Path prefix without trailing slash. Empty string = default market. */
  pathPrefix: string;
};

export const AFTERSTATE_MARKETS: MarketLocale[] = [
  {label: 'EN-EU', code: 'EU', pathPrefix: ''},
  {label: 'EN-GB', code: 'GB', pathPrefix: '/en-gb'},
  {label: 'DE-DE', code: 'DE', pathPrefix: '/de-de'},
  {label: 'FR-FR', code: 'FR', pathPrefix: '/fr-fr'},
];

/**
 * @deprecated Prefer AFTERSTATE_MARKETS — language-only list cannot reach EN-GB.
 */
export const AFTERSTATE_LANGUAGES: MarketLocale[] = [
  {label: 'EN-EU', code: 'EU', pathPrefix: ''},
  {label: 'DE-DE', code: 'DE', pathPrefix: '/de-de'},
  {label: 'FR-FR', code: 'FR', pathPrefix: '/fr-fr'},
];

export type MarketSelectorProps = {
  markets?: MarketLocale[];
  currentPathPrefix?: string;
  className?: string;
  /** `panel` = inline options for mobile menu */
  variant?: 'dropdown' | 'panel';
};

/**
 * Compact market switcher — trigger and options show short market codes.
 */
export function MarketSelector({
  markets = AFTERSTATE_MARKETS,
  currentPathPrefix,
  className,
  variant = 'dropdown',
}: MarketSelectorProps) {
  const {pathname, search} = useLocation();
  const activePrefix =
    currentPathPrefix ?? detectPathPrefix(pathname, AFTERSTATE_MARKETS);
  const activeMarket =
    markets.find(
      (market) =>
        normalizePrefix(market.pathPrefix) === normalizePrefix(activePrefix),
    ) ?? null;
  const activeCode = activeMarket?.code ?? codeFromPrefix(activePrefix);

  return (
    <details
      className={[
        styles.root,
        variant === 'panel' ? styles.menuPanel : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <summary
        className={styles.trigger}
        aria-label={`Market: ${activeMarket?.label ?? activeCode}`}
      >
        <span className={styles.code}>{activeCode}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <ul className={styles.menu} role="listbox" aria-label="Market">
        {markets.map((market) => {
          const isActive =
            normalizePrefix(market.pathPrefix) ===
            normalizePrefix(activePrefix);
          const href = isActive
            ? pathname + search
            : replaceLocaleInPath(pathname, market.pathPrefix) + search;

          return (
            <li
              key={market.label}
              role="option"
              aria-selected={isActive}
            >
              <Link
                to={href}
                prefetch="intent"
                className={[styles.option, isActive ? styles.selected : '']
                  .filter(Boolean)
                  .join(' ')}
                hrefLang={hreflangFromLabel(market.label)}
                title={market.label}
                onClick={(event) => {
                  const details = event.currentTarget.closest('details');
                  if (details) details.open = false;
                }}
              >
                {market.code}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function normalizePrefix(prefix: string): string {
  if (!prefix) return '';
  return prefix.startsWith('/')
    ? prefix.toLowerCase()
    : `/${prefix.toLowerCase()}`;
}

function detectPathPrefix(pathname: string, markets: MarketLocale[]): string {
  const match = pathname.match(/^\/([a-z]{2}-[a-z]{2})(?=\/|$)/i);
  if (!match) return '';
  const found = markets.find(
    (m) => normalizePrefix(m.pathPrefix) === `/${match[1].toLowerCase()}`,
  );
  return found?.pathPrefix ?? `/${match[1].toLowerCase()}`;
}

function codeFromPrefix(prefix: string): string {
  const found = AFTERSTATE_MARKETS.find(
    (m) => normalizePrefix(m.pathPrefix) === normalizePrefix(prefix),
  );
  if (found) return found.code;
  const match = prefix.match(/\/?[a-z]{2}-([a-z]{2})/i);
  return match ? match[1].toUpperCase() : 'EU';
}

function hreflangFromLabel(label: string): string {
  const [lang, region] = label.toLowerCase().split('-');
  if (!lang || !region) return label.toLowerCase();
  // en-EU is not a valid hreflang region; use en for the default EU English market.
  if (region === 'eu') return lang;
  return `${lang}-${region.toUpperCase()}`;
}
