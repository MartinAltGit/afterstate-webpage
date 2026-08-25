import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {ShopWelcomeBanner} from '~/components/collection/ShopWelcomeBanner';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './ShopFilters.module.css';

export type ShopFilterFamily = {
  id: string;
  name: string;
  count: number;
};

export type ShopFiltersProps = {
  families?: ShopFilterFamily[];
  className?: string;
};

function padCount(value: number) {
  return String(value).padStart(2, '0');
}

function designAnchor(id: string) {
  return `design-${id}`;
}

function spyOffset(familyIds: string[]) {
  const first = document.getElementById(designAnchor(familyIds[0] ?? ''));
  if (!first) return 96;
  return parseFloat(getComputedStyle(first).scrollMarginTop) || 96;
}

function designFromUrl(familyIds: string[]) {
  const hash = window.location.hash.replace(/^#design-/, '');
  if (familyIds.includes(hash)) return {id: hash, fromHash: true};
  const query = new URLSearchParams(window.location.search).get('design');
  if (query && familyIds.includes(query)) return {id: query, fromHash: false};
  return null;
}

/**
 * Drop index — design names only. Compact bar on small screens, left rail on desktop.
 * Highlights the collection currently in view.
 */
export function ShopFilters({families = [], className}: ShopFiltersProps) {
  const reduced = usePrefersReducedMotion();
  const jumpsRef = useRef<HTMLUListElement>(null);
  const familyIds = families.map((family) => family.id);
  const familyKey = familyIds.join('|');
  const [activeId, setActiveId] = useState(familyIds[0] ?? '');

  useEffect(() => {
    const ids = familyKey ? familyKey.split('|') : [];
    if (ids.length === 0) return;

    const landing = designFromUrl(ids);
    if (landing) {
      setActiveId(landing.id);
      if (!landing.fromHash) {
        document.getElementById(designAnchor(landing.id))?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      }
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = spyOffset(ids);
      let current = ids[0] ?? '';
      for (const id of ids) {
        const node = document.getElementById(designAnchor(id));
        if (!node) continue;
        if (node.getBoundingClientRect().top - offset <= 1) current = id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    if (!landing) update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', update);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', update);
    };
  }, [familyKey]);

  useEffect(() => {
    const scroller = jumpsRef.current;
    const active = scroller?.querySelector('[aria-current="location"]');
    if (!scroller || !(active instanceof HTMLElement)) return;
    const left =
      active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2;
    scroller.scrollTo({
      left: Math.max(0, left),
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [activeId, reduced]);

  if (families.length === 0) return null;

  const jumpTo = (id: string) => {
    const node = document.getElementById(designAnchor(id));
    if (!node) return;
    setActiveId(id);
    node.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    });
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${designAnchor(id)}`,
    );
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <nav className={styles.block} aria-label="Shop by design">
        <p className={styles.label}>Designs</p>
        <ul ref={jumpsRef} className={styles.jumps}>
          {families.map((family, index) => {
            const isCurrent = activeId === family.id;
            return (
              <li key={family.id}>
                <Link
                  to={`#${designAnchor(family.id)}`}
                  preventScrollReset
                  className={[
                    styles.jump,
                    isCurrent ? styles.jumpActive : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={isCurrent ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    jumpTo(family.id);
                  }}
                >
                  <span className={styles.jumpIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.jumpName}>{family.name}</span>
                  <span className={styles.jumpCount} aria-hidden="true">
                    {padCount(family.count)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ShopWelcomeBanner className={styles.offer} />
    </div>
  );
}
