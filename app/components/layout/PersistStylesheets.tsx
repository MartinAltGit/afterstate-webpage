import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useLocation, useNavigation} from 'react-router';

type KnownLink = {
  href: string;
  crossOrigin: string | null;
  media: string | null;
  globalStyle: string | null;
};

/**
 * Module-level caches survive remounts. React owns <head> via hydrateRoot(document),
 * so restored nodes can be purged on the next Layout reconcile — we still restore
 * aggressively (sync) and re-enable React-managed global links when they go missing.
 *
 * @see https://github.com/remix-run/react-router/issues/14413
 */
const knownHrefs = new Map<string, KnownLink>();
const knownViteStyles = new Map<string, string>();

function normalizeHref(href: string) {
  try {
    const url = new URL(href, window.location.origin);
    // RR dynamic-import CSS may use a trailing "#" marker
    url.hash = '';
    return url.href;
  } catch {
    return href.replace(/#$/, '');
  }
}

function collectFromHead(head: HTMLHeadElement) {
  for (const link of head.querySelectorAll<HTMLLinkElement>(
    'link[rel="stylesheet"]',
  )) {
    if (!link.href) continue;
    const href = normalizeHref(link.href);
    knownHrefs.set(href, {
      href,
      crossOrigin: link.getAttribute('crossorigin'),
      media: link.getAttribute('media'),
      globalStyle: link.getAttribute('data-global-style'),
    });
  }

  for (const style of head.querySelectorAll<HTMLStyleElement>(
    'style[data-vite-dev-id]',
  )) {
    const id = style.getAttribute('data-vite-dev-id');
    if (id) knownViteStyles.set(id, style.textContent ?? '');
  }
}

function hasStylesheet(head: HTMLHeadElement, href: string) {
  const target = normalizeHref(href);
  return Array.from(
    head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  ).some((el) => el.href && normalizeHref(el.href) === target);
}

function restoreLink(head: HTMLHeadElement, meta: KnownLink) {
  if (hasStylesheet(head, meta.href)) return;

  // Prefer resurrecting React-managed global foundation links in place
  if (meta.globalStyle) {
    const existing = head.querySelector<HTMLLinkElement>(
      `link[data-global-style="${meta.globalStyle}"]`,
    );
    if (existing) {
      const current = existing.getAttribute('href');
      if (current) {
        existing.setAttribute('href', current);
      }
      return;
    }
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = meta.href;
  link.setAttribute('data-afterstate-restored', 'true');
  if (meta.crossOrigin) link.crossOrigin = meta.crossOrigin;
  if (meta.media) link.media = meta.media;
  if (meta.globalStyle) {
    link.setAttribute('data-global-style', meta.globalStyle);
  }
  head.appendChild(link);
}

function restoreViteStyle(head: HTMLHeadElement, id: string, cssText: string) {
  const escaped =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(id)
      : id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (head.querySelector(`style[data-vite-dev-id="${escaped}"]`)) return;
  const style = document.createElement('style');
  style.setAttribute('data-vite-dev-id', id);
  style.setAttribute('data-afterstate-restored', 'true');
  style.textContent = cssText;
  head.appendChild(style);
}

function restoreAll(head: HTMLHeadElement) {
  for (const meta of knownHrefs.values()) restoreLink(head, meta);
  for (const [id, cssText] of knownViteStyles) {
    restoreViteStyle(head, id, cssText);
  }
}

/**
 * Prevents unstyled / half-styled pages when React Router removes stylesheet
 * nodes during client navigations (especially browser Back).
 */
export function PersistStylesheets() {
  const location = useLocation();
  const navigation = useNavigation();
  const restorePass = useRef(0);

  // Keep listening for head mutations for the life of the document
  useEffect(() => {
    const head = document.head;
    collectFromHead(head);
    restoreAll(head);

    const observer = new MutationObserver((mutations) => {
      let needsRestore = false;

      for (const mutation of mutations) {
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') {
            if (node.href) {
              const href = normalizeHref(node.href);
              knownHrefs.set(href, {
                href,
                crossOrigin: node.getAttribute('crossorigin'),
                media: node.getAttribute('media'),
                globalStyle: node.getAttribute('data-global-style'),
              });
              needsRestore = true;
            }
          }

          if (node instanceof HTMLStyleElement) {
            const id = node.getAttribute('data-vite-dev-id');
            if (id) {
              knownViteStyles.set(
                id,
                node.textContent ?? knownViteStyles.get(id) ?? '',
              );
              needsRestore = true;
            }
          }
        }

        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLLinkElement &&
            node.rel === 'stylesheet' &&
            node.href
          ) {
            const href = normalizeHref(node.href);
            knownHrefs.set(href, {
              href,
              crossOrigin: node.getAttribute('crossorigin'),
              media: node.getAttribute('media'),
              globalStyle: node.getAttribute('data-global-style'),
            });
          }
          if (node instanceof HTMLStyleElement) {
            const id = node.getAttribute('data-vite-dev-id');
            if (id) knownViteStyles.set(id, node.textContent ?? '');
          }
        }
      }

      if (needsRestore) {
        // Sync restore — rAF alone leaves a blank painted frame
        restoreAll(head);
        restorePass.current += 1;
        requestAnimationFrame(() => restoreAll(head));
      }
    });

    observer.observe(head, {childList: true});

    const onPageShow = (event: PageTransitionEvent) => {
      collectFromHead(head);
      restoreAll(head);
      if (event.persisted) {
        requestAnimationFrame(() => restoreAll(head));
      }
    };

    const onPopState = () => {
      restoreAll(head);
      requestAnimationFrame(() => restoreAll(head));
    };

    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('popstate', onPopState);

    return () => {
      observer.disconnect();
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // Re-check after every React Router transition (PUSH / REPLACE / POP)
  useLayoutEffect(() => {
    const head = document.head;
    collectFromHead(head);
    restoreAll(head);
    const id = window.setTimeout(() => restoreAll(head), 0);
    return () => window.clearTimeout(id);
  }, [location.key, navigation.state]);

  return null;
}
