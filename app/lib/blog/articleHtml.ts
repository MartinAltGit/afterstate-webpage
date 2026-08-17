export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type FaqItem = {
  question: string;
  answer: string;
};

const HEADING_RE = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
const FAQ_BLOCK_RE =
  /<div[^>]*class=["'][^"']*\bblog-faq\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i;
const FAQ_PAIR_RE =
  /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;

export function decodeBasicEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripHtml(html: string) {
  return decodeBasicEntities(html.replace(/<[^>]*>/g, ' '));
}

export function slugifyHeading(text: string) {
  const slug = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

  return slug || 'section';
}

function uniqueId(base: string, used: Map<string, number>) {
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

export function prepareArticleHtml(html: string): {
  html: string;
  headings: ArticleHeading[];
} {
  const used = new Map<string, number>();
  const headings: ArticleHeading[] = [];
  HEADING_RE.lastIndex = 0;

  const next = html.replace(
    HEADING_RE,
    (_match, level: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return _match;

      const existing = attrs.match(/\sid=["']([^"']+)["']/i);
      const id = uniqueId(
        existing?.[1] ? existing[1].trim() : slugifyHeading(text),
        used,
      );
      headings.push({
        id,
        text,
        level: Number(level) as 2 | 3,
      });

      const withoutId = attrs.replace(/\sid=["'][^"']*["']/i, '');
      return `<h${level}${withoutId} id="${id}">${inner}</h${level}>`;
    },
  );

  return {html: next, headings};
}

export function tocHeadings(headings: ArticleHeading[], minCount = 2) {
  const items = headings.filter((heading) => heading.level === 2);
  return items.length >= minCount ? items : [];
}

export function hasBlogClass(html: string, className: string) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`class=["'][^"']*\\b${escaped}\\b`, 'i').test(html);
}

export function extractFaq(html: string): FaqItem[] {
  const block = html.match(FAQ_BLOCK_RE);
  const inner =
    block?.[1] ??
    html.match(
      /<h2[^>]*>[\s\S]*?(?:frequently asked questions|faq)[\s\S]*?<\/h2>([\s\S]*?)(?=<h2|$)/i,
    )?.[1];

  if (!inner) return [];

  const items: FaqItem[] = [];
  FAQ_PAIR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = FAQ_PAIR_RE.exec(inner))) {
    const question = stripHtml(match[1]);
    const answer = stripHtml(match[2]);
    if (question && answer) items.push({question, answer});
  }
  return items;
}

export function readingMinutesFromHtml(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Render headlines without the em-dash hinge that reads as generated copy. */
export function displayArticleTitle(title: string) {
  return title
    .replace(/\s*[—–−]\s*/g, ', ')
    .replace(/\s*,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
