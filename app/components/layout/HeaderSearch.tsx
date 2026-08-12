import {Image, Money} from '@shopify/hydrogen';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {Link, useFetcher, useNavigate} from 'react-router';
import {VisuallyHidden} from '~/components/primitives/VisuallyHidden';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {SEARCH_ENDPOINT} from '~/components/SearchFormPredictive';
import styles from './HeaderSearch.module.css';

const SUGGESTED = ['hoodie', 'No Rush', 'cap', 'journal'] as const;

type HeaderSearchProps = {
  className?: string;
};

/**
 * Inline nav search — expands left from the icon, pushes Journal / market aside,
 * and shows a compact suggestion dropdown.
 */
export function HeaderSearch({className}: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'header-search'});
  const navigate = useNavigate();
  const localePrefix = useLocalePathPrefix();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open, close]);

  const fetchResults = useCallback(
    (value: string) => {
      void fetcher.submit(
        {q: value, limit: 5, predictive: true},
        {method: 'GET', action: prefixPathWithLocale(SEARCH_ENDPOINT, localePrefix)},
      );
    },
    [fetcher, localePrefix],
  );

  const onChange = (value: string) => {
    setQuery(value);
    fetchResults(value);
  };

  const goToSearch = (term = query) => {
    const path = prefixPathWithLocale(SEARCH_ENDPOINT, localePrefix);
    void navigate(term ? `${path}?q=${encodeURIComponent(term)}` : path);
    close();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToSearch();
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  const result = fetcher.data?.result ?? getEmptyPredictiveSearchResult();
  const {products, collections, queries} = result.items;
  const isLoading = fetcher.state === 'loading' || fetcher.state === 'submitting';
  const hasTyped = query.trim().length > 0;
  const hasLiveResults =
    products.length > 0 || collections.length > 0 || queries.length > 0;

  return (
    <div
      ref={rootRef}
      className={[styles.root, open ? styles.open : null, className]
        .filter(Boolean)
        .join(' ')}
    >
      <form className={styles.shell} onSubmit={onSubmit} role="search">
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          name="q"
          value={query}
          placeholder="Search"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label="Search Afterstate"
          tabIndex={open ? 0 : -1}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onInputKeyDown}
          onFocus={() => {
            if (!open) openSearch();
            if (query) fetchResults(query);
          }}
        />
        <button
          type="button"
          className={styles.toggle}
          aria-label={open ? 'Close search' : 'Search'}
          aria-expanded={open}
          onClick={() => {
            if (open) close();
            else openSearch();
          }}
        >
          {open ? <CloseIcon /> : <SearchIcon />}
          <VisuallyHidden>{open ? 'Close search' : 'Search'}</VisuallyHidden>
        </button>
      </form>

      {open ? (
        <div className={styles.dropdown} id={listId} role="listbox">
          {!hasTyped ? (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Suggested</p>
              <ul className={styles.suggestList}>
                {SUGGESTED.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      className={styles.suggestButton}
                      onClick={() => {
                        setQuery(term);
                        fetchResults(term);
                        inputRef.current?.focus();
                      }}
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {hasTyped && isLoading && !hasLiveResults ? (
            <p className={styles.status}>Searching…</p>
          ) : null}

          {hasTyped && !isLoading && !hasLiveResults ? (
            <p className={styles.status}>
              No results for <q>{query}</q>
            </p>
          ) : null}

          {queries.length > 0 ? (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Suggestions</p>
              <ul className={styles.suggestList}>
                {queries.slice(0, 4).map((suggestion) => {
                  if (!suggestion?.text) return null;
                  return (
                    <li key={suggestion.text}>
                      <button
                        type="button"
                        className={styles.suggestButton}
                        onClick={() => goToSearch(suggestion.text)}
                      >
                        {suggestion.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Products</p>
              <ul className={styles.resultList}>
                {products.slice(0, 4).map((product) => {
                  const href = urlWithTrackingParams({
                    baseUrl: prefixPathWithLocale(
                      `/products/${product.handle}`,
                      localePrefix,
                    ),
                    trackingParams: product.trackingParameters,
                    term: query,
                  });
                  const image =
                    product.selectedOrFirstAvailableVariant?.image;
                  const price =
                    product.selectedOrFirstAvailableVariant?.price;

                  return (
                    <li key={product.id}>
                      <Link
                        className={styles.resultLink}
                        to={href}
                        prefetch="intent"
                        onClick={close}
                      >
                        {image?.url ? (
                          <Image
                            data={image}
                            alt={image.altText || product.title}
                            width={40}
                            height={40}
                            className={styles.thumb}
                            sizes="40px"
                          />
                        ) : (
                          <span className={styles.thumbFallback} />
                        )}
                        <span className={styles.resultCopy}>
                          <span className={styles.resultTitle}>
                            {product.title}
                          </span>
                          {price ? (
                            <span className={styles.resultMeta}>
                              <Money data={price} />
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {collections.length > 0 ? (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Collections</p>
              <ul className={styles.resultList}>
                {collections.slice(0, 3).map((collection) => {
                  const href = urlWithTrackingParams({
                    baseUrl: prefixPathWithLocale(
                      `/collections/${collection.handle}`,
                      localePrefix,
                    ),
                    trackingParams: collection.trackingParameters,
                    term: query,
                  });

                  return (
                    <li key={collection.id}>
                      <Link
                        className={styles.resultLink}
                        to={href}
                        prefetch="intent"
                        onClick={close}
                      >
                        <span className={styles.resultCopy}>
                          <span className={styles.resultTitle}>
                            {collection.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {hasTyped ? (
            <button
              type="button"
              className={styles.viewAll}
              onClick={() => goToSearch()}
            >
              View all results
              <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className={styles.glyph}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 16.5 20 20.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className={styles.glyph}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
