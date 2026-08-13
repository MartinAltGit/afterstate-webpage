/**
 * Approximate a swatch when Shopify has no color/image on the option.
 */
export function guessSwatchColor(name: string): string | null {
  const n = name.toLowerCase();
  if (/melange|heather/.test(n) && /grey|gray/.test(n)) return '#9a9d96';
  if (/charcoal|graphite|anthracite/.test(n)) return '#3d4340';
  if (/light\s*(grey|gray)|silver|ash/.test(n)) return '#c4c6c0';
  if (/grey|gray|stone/.test(n)) return '#7c817b';
  if (/off[\s-]?white|ivory|bone|cream|ecru/.test(n)) return '#ece7da';
  if (/white/.test(n)) return '#f4f1ea';
  if (/black|noir|ink|obsidian/.test(n)) return '#141a18';
  if (/navy|midnight/.test(n)) return '#1c2a3a';
  if (/burgundy|wine|oxblood/.test(n)) return '#6b2d32';
  if (/olive|khaki/.test(n)) return '#5c6148';
  if (/forest|bottle/.test(n)) return '#2c3a32';
  if (/sand|beige|taupe/.test(n)) return '#cbbba0';
  if (/brown|chocolate|mocha/.test(n)) return '#5a4336';
  if (/red|scarlet/.test(n)) return '#8a2e2e';
  if (/blue/.test(n)) return '#3a4f63';
  if (/green/.test(n)) return '#3e5346';
  if (/pink|blush/.test(n)) return '#c9a4a0';
  if (/yellow|mustard/.test(n)) return '#c4a45a';
  return null;
}

export function isColorOptionName(name: string): boolean {
  return /^(colou?r|farbe|colore|coloris|teinte)$/i.test(name.trim());
}
