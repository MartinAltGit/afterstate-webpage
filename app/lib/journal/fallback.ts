import campaignLookAlt from '~/assets/mockups/campaign-look-alt.jpg';
import campaignLook from '~/assets/mockups/campaign-look.jpg';
import lookbook01 from '~/assets/mockups/lookbook-01.jpg';
import lookbook02 from '~/assets/mockups/lookbook-02.jpg';
import lookbook03 from '~/assets/mockups/lookbook-03.jpg';
import heroHoodies from '~/assets/mockups/hero-campaign-hoodies.jpg';
import heroCaps from '~/assets/mockups/hero-campaign-caps.jpg';

export type FallbackJournalImage = {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type FallbackJournalArticle = {
  handle: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  publishedAt: string;
  authorName: string;
  seoDescription: string;
  hero: FallbackJournalImage;
  relatedHandles: string[];
};

function img(
  id: string,
  url: string,
  altText: string,
  width = 1600,
  height = 1200,
): FallbackJournalImage {
  return {id, url, altText, width, height};
}

export const FALLBACK_JOURNAL_ARTICLES: Record<string, FallbackJournalArticle> =
  {
    'no-rush': {
      handle: 'no-rush',
      title: 'On No Rush',
      eyebrow: 'Origin',
      excerpt:
        'How Afterstate began — not with a drop calendar, but with a refusal to hurry clothes into the world.',
      publishedAt: '2025-11-12T10:00:00Z',
      authorName: 'Afterstate Studio',
      seoDescription:
        'The fictional origin of Afterstate and why No Rush became the first collection — fewer pieces, clearer intent, clothes made to last.',
      hero: img(
        'no-rush-hero',
        campaignLookAlt,
        'Model in Afterstate 001 No Rush campaign hoodie at dusk',
      ),
      relatedHandles: ['life-beyond-the-rush', 'the-weight-of-quiet-clothing'],
    },
    'life-beyond-the-rush': {
      handle: 'life-beyond-the-rush',
      title: 'Life beyond the rush',
      eyebrow: 'Notes',
      excerpt:
        'A longer note on pace, wardrobe, and the quiet decision to own less — and wear it harder.',
      publishedAt: '2025-12-03T10:00:00Z',
      authorName: 'Afterstate Studio',
      seoDescription:
        'Afterstate on life beyond the rush — slowing the wardrobe, choosing permanence, and dressing without urgency.',
      hero: img(
        'beyond-hero',
        campaignLook,
        'Afterstate campaign look in quiet evening light',
      ),
      relatedHandles: ['no-rush', 'the-weight-of-quiet-clothing'],
    },
    'the-weight-of-quiet-clothing': {
      handle: 'the-weight-of-quiet-clothing',
      title: 'The weight of quiet clothing',
      eyebrow: 'Materials',
      excerpt:
        'Heavy cotton, brushed fleece, and the small decisions that decide how a piece ages on your body.',
      publishedAt: '2026-01-18T10:00:00Z',
      authorName: 'Afterstate Studio',
      seoDescription:
        'Inside Afterstate quality — fabric weight, construction, and why quiet clothing is built to outlast seasons.',
      hero: img(
        'quiet-hero',
        lookbook01,
        'Close look at Afterstate muted teal outerwear fabric and AS mark',
      ),
      relatedHandles: ['no-rush', 'life-beyond-the-rush'],
    },
  };

export const FALLBACK_JOURNAL_LIST = Object.values(FALLBACK_JOURNAL_ARTICLES);

export const JOURNAL_IMAGES = {
  campaignLookAlt: img(
    'campaign-look-alt',
    campaignLookAlt,
    'Afterstate No Rush campaign at dusk',
  ),
  campaignLook: img(
    'campaign-look',
    campaignLook,
    'Afterstate campaign look in evening light',
  ),
  lookbook01: img(
    'lookbook-01',
    lookbook01,
    'Afterstate fabric detail and AS mark',
  ),
  lookbook02: img(
    'lookbook-02',
    lookbook02,
    'Afterstate lookbook frame — quiet silhouette',
  ),
  lookbook03: img(
    'lookbook-03',
    lookbook03,
    'Afterstate lookbook frame — street evening',
  ),
  heroHoodies: img(
    'hero-hoodies',
    heroHoodies,
    'Afterstate hoodies from the No Rush campaign',
  ),
  heroCaps: img(
    'hero-caps',
    heroCaps,
    'Afterstate caps from the No Rush campaign',
  ),
} as const;

export function getFallbackJournalArticle(handle: string) {
  return FALLBACK_JOURNAL_ARTICLES[handle] ?? null;
}
