import {useEffect} from 'react';

/**
 * Prevents unstyled pages when React Router / Vite removes stylesheet nodes
 * during client navigations (especially browser Back).
 *
 * Re-inserts stylesheet <link> tags and Vite HMR <style> tags that disappear
 * from <head>, and restores them again after bfcache pageshow.
 *
 * @see https://github.com/remix-run/react-router/issues/14413
 */
export function PersistStylesheets() {
  useEffect(() => {
    const head = document.head;
    const knownHrefs = new Set<string>();
    const knownViteStyles = new Map<string, string>();

    const hasStylesheet = (href: string) =>
      Array.from(
        head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
      ).some((el) => el.href === href);

    const restoreLink = (href: string) => {
      if (!href || hasStylesheet(href)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-afterstate-restored', 'true');
      head.appendChild(link);
    };

    const restoreViteStyle = (id: string, cssText: string) => {
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
    };

    const restoreAll = () => {
      for (const href of knownHrefs) restoreLink(href);
      for (const [id, cssText] of knownViteStyles) {
        restoreViteStyle(id, cssText);
      }
    };

    for (const link of head.querySelectorAll<HTMLLinkElement>(
      'link[rel="stylesheet"]',
    )) {
      if (link.href) knownHrefs.add(link.href);
    }

    for (const style of head.querySelectorAll<HTMLStyleElement>(
      'style[data-vite-dev-id]',
    )) {
      const id = style.getAttribute('data-vite-dev-id');
      if (id) knownViteStyles.set(id, style.textContent ?? '');
    }

    const observer = new MutationObserver((mutations) => {
      let needsRestore = false;

      for (const mutation of mutations) {
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') {
            if (node.href) {
              knownHrefs.add(node.href);
              needsRestore = true;
            }
          }

          if (node instanceof HTMLStyleElement) {
            const id = node.getAttribute('data-vite-dev-id');
            if (id) {
              knownViteStyles.set(id, node.textContent ?? knownViteStyles.get(id) ?? '');
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
            knownHrefs.add(node.href);
          }
          if (node instanceof HTMLStyleElement) {
            const id = node.getAttribute('data-vite-dev-id');
            if (id) knownViteStyles.set(id, node.textContent ?? '');
          }
        }
      }

      if (needsRestore) {
        requestAnimationFrame(restoreAll);
      }
    });

    observer.observe(head, {childList: true});

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) restoreAll();
    };

    // Also re-check after POP navigations complete
    const onPopState = () => {
      requestAnimationFrame(restoreAll);
    };

    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('popstate', onPopState);

    return () => {
      observer.disconnect();
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return null;
}
