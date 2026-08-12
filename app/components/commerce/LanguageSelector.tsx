import {Link, useLocation} from 'react-router';
import {replaceLocaleInPath} from '~/lib/locale-path';
import styles from './LanguageSelector.module.css';

export type LanguageOption = {
  /** Display name, e.g. English */
  name: string;
  /** Short code for compact UI */
  code: string;
  /** Path prefix without trailing slash. Empty = default English. */
  pathPrefix: string;
  /** BCP 47 / hreflang */
  hreflang: string;
};

/** UI languages — translations land later; routes already exist for DE / FR. */
export const AFTERSTATE_UI_LANGUAGES: LanguageOption[] = [
  {name: 'English', code: 'EN', pathPrefix: '', hreflang: 'en'},
  {name: 'German', code: 'DE', pathPrefix: '/de-de', hreflang: 'de-DE'},
  {name: 'French', code: 'FR', pathPrefix: '/fr-fr', hreflang: 'fr-FR'},
];

export type LanguageSelectorProps = {
  languages?: LanguageOption[];
  currentPathPrefix?: string;
  className?: string;
};

/**
 * Language switcher — full names for now; copy translations come later.
 */
export function LanguageSelector({
  languages = AFTERSTATE_UI_LANGUAGES,
  currentPathPrefix,
  className,
}: LanguageSelectorProps) {
  const {pathname, search} = useLocation();
  const activePrefix =
    currentPathPrefix ?? detectPathPrefix(pathname, languages);
  const active =
    languages.find(
      (lang) =>
        normalizePrefix(lang.pathPrefix) === normalizePrefix(activePrefix),
    ) ?? languages[0];

  return (
    <details
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <summary
        className={styles.trigger}
        aria-label={`Language: ${active?.name ?? 'English'}`}
      >
        <span className={styles.label}>{active?.name ?? 'English'}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <ul className={styles.menu} role="listbox" aria-label="Language">
        {languages.map((lang) => {
          const isActive =
            normalizePrefix(lang.pathPrefix) ===
            normalizePrefix(activePrefix);
          const href = isActive
            ? pathname + search
            : replaceLocaleInPath(pathname, lang.pathPrefix) + search;

          return (
            <li key={lang.code} role="option" aria-selected={isActive}>
              <Link
                to={href}
                prefetch="intent"
                className={[styles.option, isActive ? styles.selected : null]
                  .filter(Boolean)
                  .join(' ')}
                hrefLang={lang.hreflang}
                onClick={(event) => {
                  const details = event.currentTarget.closest('details');
                  if (details) details.open = false;
                }}
              >
                <span className={styles.optionName}>{lang.name}</span>
                <span className={styles.optionCode}>{lang.code}</span>
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

function detectPathPrefix(
  pathname: string,
  languages: LanguageOption[],
): string {
  const match = pathname.match(/^\/([a-z]{2}-[a-z]{2})(?=\/|$)/i);
  if (!match) return '';
  const found = languages.find(
    (lang) =>
      normalizePrefix(lang.pathPrefix) === `/${match[1].toLowerCase()}`,
  );
  return found?.pathPrefix ?? `/${match[1].toLowerCase()}`;
}
