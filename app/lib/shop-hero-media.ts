import afterThis from '~/assets/mockups/shop-hero/after-this.jpg';
import noRush from '~/assets/mockups/shop-hero/no-rush.jpg';
import notYet from '~/assets/mockups/shop-hero/not-yet.jpg';
import sayLess from '~/assets/mockups/shop-hero/say-less.jpg';

export const SHOP_HERO_SLIDE_MS = 6200;

/**
 * Lookbook stills for the shop header — landscape frames with the pair
 * packed on the right. Mobile crops via `--shop-hero-crop` (object-position).
 */
export const SHOP_HERO_SLIDES = [
  {
    id: 'no-rush',
    name: 'No Rush',
    pieces: 'Tee · Crew · Cap',
    image: noRush,
    crop: '100% 20%',
    alt: 'A woman in the sage No Rush tee and forest cap beside a man in the bone crew layered over the green tee.',
  },
  {
    id: 'not-yet',
    name: 'Not Yet',
    pieces: 'Tee · Crew · Cap',
    image: notYet,
    crop: '100% 20%',
    alt: 'A woman in the navy Not Yet tee and cap beside a man in the burgundy crew layered over the navy tee.',
  },
  {
    id: 'say-less',
    name: 'Say Less',
    pieces: 'Tee · Hoodie · Cap',
    image: sayLess,
    crop: '100% 18%',
    alt: 'A woman in the crimson Say Less tee and burgundy cap beside a man in the navy hoodie layered over the red tee.',
  },
  {
    id: 'after-this',
    name: 'After This',
    pieces: 'Tee · Hoodie · Cap',
    image: afterThis,
    crop: '100% 20%',
    alt: 'A woman in the bone After This tee and bone cap beside a man in the forest hoodie layered over the cream tee.',
  },
] as const;
