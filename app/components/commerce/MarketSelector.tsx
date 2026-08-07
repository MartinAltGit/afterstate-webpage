import {Link, useLocation} from 'react-router';
import {replaceLocaleInPath} from '~/lib/locale-path';
import styles from './MarketSelector.module.css';

export type MarketLocale = {
  /** Full market label, e.g. EN-US */
  label: string;
  /** Two-letter language code shown in the UI */
  code: string;
  /** Path prefix without trailing slash. Empty string = default market. */
  pathPrefix: string;
};

export const AFTERSTATE_MARKETS: MarketLocale[] = [
  {label: 'EN-US', code: 'EN', pathPrefix: ''},
  {label: 'EN-GB', code: 'EN', pathPrefix: '/en-gb'},
  {label: 'EN-EU', code: 'EN', pathPrefix: '/en-eu'},
  {label: 'DE-DE', code: 'DE', pathPrefix: '/de-de'},
  {label: 'FR-FR', code: 'FR', pathPrefix: '/fr-fr'},
];

/** Languages shown in the dropdown — one entry per language code. */
export const AFTERSTATE_LANGUAGES: MarketLocale[] = [
  {label: 'EN-US', code: 'EN', pathPrefix: ''},
  {label: 'DE-DE', code: 'DE', pathPrefix: '/de-de'},
  {label: 'FR-FR', code: 'FR', pathPrefix: '/fr-fr'},
];

export type MarketSelectorProps = {
  markets?: MarketLocale[];
  currentPathPrefix?: string;
  className?: string;
};

/**
 * Compact language dropdown — trigger and options show two-letter codes only.
 */
export function MarketSelector({
  markets = AFTERSTATE_LANGUAGES,
  currentPathPrefix,
  className,
}: MarketSelectorProps) {
  const {pathname, search} = useLocation();
  const activePrefix =
    currentPathPrefix ?? detectPathPrefix(pathname, AFTERSTATE_MARKETS);
  const activeCode = codeFromPrefix(activePrefix, AFTERSTATE_MARKETS);

  return (
    <details
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <summary
        className={styles.trigger}
        aria-label={`Language: ${activeCode}`}
      >
        <span className={styles.code}>{activeCode}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <ul className={styles.menu} role="listbox" aria-label="Language">
        {markets.map((market) => {
          const isActiveLanguage = market.code === activeCode;
          const href = isActiveLanguage
            ? pathname + search
            : replaceLocaleInPath(pathname, market.pathPrefix) + search;

          return (
            <li key={market.code} role="option" aria-selected={isActiveLanguage}>
              <Link
                to={href}
                prefetch="intent"
                className={[
                  styles.option,
                  isActiveLanguage ? styles.selected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                hrefLang={hreflangFromLabel(market.label)}
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

function codeFromPrefix(prefix: string, markets: MarketLocale[]): string {
  const found = markets.find(
    (m) => normalizePrefix(m.pathPrefix) === normalizePrefix(prefix),
  );
  if (found) return found.code;
  const match = prefix.match(/\/?([a-z]{2})-/i);
  return match ? match[1].toUpperCase() : 'EN';
}

function hreflangFromLabel(label: string): string {
  const [lang, region] = label.toLowerCase().split('-');
  if (!lang || !region) return label.toLowerCase();
  return `${lang}-${region.toUpperCase()}`;
}
