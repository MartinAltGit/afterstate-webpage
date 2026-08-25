/**
 * Apparel size order independent of Shopify option position.
 * Maps M / L / XL / 2XL (and XS–5XL, numeric waists) into a stable sequence.
 */

const ALPHA_RANK: Record<string, number> = {
  XXXXS: 0,
  XXXS: 1,
  XXS: 2,
  XS: 3,
  S: 4,
  M: 5,
  L: 6,
  XL: 7,
  XXL: 8,
  '2XL': 8,
  XXXL: 9,
  '3XL': 9,
  XXXXL: 10,
  '4XL': 10,
  XXXXXL: 11,
  '5XL': 11,
  '6XL': 12,
  '7XL': 13,
};

function normalizeSizeKey(label: string): string {
  return label
    .trim()
    .toUpperCase()
    .replace(/[\s._-]+/g, '')
    .replace(/×/g, 'X');
}

function isOneSize(key: string): boolean {
  return (
    key === 'OS' ||
    key === 'ONESIZE' ||
    key === 'ONE' ||
    key === 'OSFA' ||
    key === 'UNI' ||
    key === 'UNISEX'
  );
}

function alphaRank(key: string): number | null {
  if (key in ALPHA_RANK) return ALPHA_RANK[key];
  const numbered = key.match(/^(\d+)X+L$/);
  if (numbered) return 6 + Number(numbered[1]);
  return null;
}

function numericRank(key: string): number | null {
  if (!/^(?:UK|EU|US|IT|FR|DE)?\d/.test(key)) return null;
  const match = key.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

export function compareSizeLabels(a: string, b: string): number {
  const ka = normalizeSizeKey(a);
  const kb = normalizeSizeKey(b);

  if (isOneSize(ka) !== isOneSize(kb)) return isOneSize(ka) ? -1 : 1;

  const aa = alphaRank(ka);
  const ab = alphaRank(kb);
  if (aa != null && ab != null && aa !== ab) return aa - ab;
  if (aa != null && ab == null) return -1;
  if (aa == null && ab != null) return 1;

  const na = numericRank(ka);
  const nb = numericRank(kb);
  if (na != null && nb != null && na !== nb) return na - nb;

  return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
}

export function sortBySize<T>(
  items: readonly T[],
  label: (item: T) => string,
): T[] {
  return [...items].sort((left, right) =>
    compareSizeLabels(label(left), label(right)),
  );
}
