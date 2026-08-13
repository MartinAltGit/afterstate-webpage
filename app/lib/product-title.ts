/**
 * Display helpers for long Shopify titles and description ledes.
 */

export function splitProductTitle(title: string): {
  headline: string;
  support?: string;
} {
  const trimmed = title.trim();
  const match = trimmed.match(/^(.*?)\s+[–—|]\s+(.*)$/);
  if (match?.[1] && match[2] && match[1].length >= 6) {
    return {headline: match[1].trim(), support: match[2].trim()};
  }
  return {headline: trimmed};
}

export function firstSentence(text: string | null | undefined, max = 140): string | null {
  if (!text?.trim()) return null;
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentence = clean.match(/^[^.!?]+[.!?]/)?.[0] ?? clean;
  if (sentence.length <= max) return sentence;
  return `${sentence.slice(0, max).replace(/\s+\S*$/, '')}…`;
}
