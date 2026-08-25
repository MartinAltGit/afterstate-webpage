import type {ProductMediaItem} from '~/components/commerce/ProductMedia';
import afterThisCapCloseup from '~/assets/mockups/product-stage/after-this-cap/closeup.jpg';
import afterThisCapProduct from '~/assets/mockups/product-stage/after-this-cap/product.jpg';
import afterThisCapWorn from '~/assets/mockups/product-stage/after-this-cap/worn.jpg';
import afterThisCapWornAlt from '~/assets/mockups/product-stage/after-this-cap/worn-alt.jpg';
import afterThisHoodieCloseup from '~/assets/mockups/product-stage/after-this-hoodie/closeup.jpg';
import afterThisHoodieProduct from '~/assets/mockups/product-stage/after-this-hoodie/product.jpg';
import afterThisHoodieWorn from '~/assets/mockups/product-stage/after-this-hoodie/worn.jpg';
import afterThisHoodieWornAlt from '~/assets/mockups/product-stage/after-this-hoodie/worn-alt.jpg';
import afterThisTeeCloseup from '~/assets/mockups/product-stage/after-this-t-shirt/closeup.jpg';
import afterThisTeeProduct from '~/assets/mockups/product-stage/after-this-t-shirt/product.jpg';
import afterThisTeeWorn from '~/assets/mockups/product-stage/after-this-t-shirt/worn.jpg';
import afterThisTeeWornAlt from '~/assets/mockups/product-stage/after-this-t-shirt/worn-alt.jpg';
import noRushCapCloseup from '~/assets/mockups/product-stage/no-rush-cap/closeup.jpg';
import noRushCapProduct from '~/assets/mockups/product-stage/no-rush-cap/product.jpg';
import noRushCapWorn from '~/assets/mockups/product-stage/no-rush-cap/worn.jpg';
import noRushCapWornAlt from '~/assets/mockups/product-stage/no-rush-cap/worn-alt.jpg';
import noRushCrewCloseup from '~/assets/mockups/product-stage/no-rush-sweatshirt/closeup.jpg';
import noRushCrewProduct from '~/assets/mockups/product-stage/no-rush-sweatshirt/product.jpg';
import noRushCrewWorn from '~/assets/mockups/product-stage/no-rush-sweatshirt/worn.jpg';
import noRushCrewWornAlt from '~/assets/mockups/product-stage/no-rush-sweatshirt/worn-alt.jpg';
import noRushTeeCloseup from '~/assets/mockups/product-stage/no-rush-t-shirt/closeup.jpg';
import noRushTeeProduct from '~/assets/mockups/product-stage/no-rush-t-shirt/product.jpg';
import noRushTeeWorn from '~/assets/mockups/product-stage/no-rush-t-shirt/worn.jpg';
import noRushTeeWornAlt from '~/assets/mockups/product-stage/no-rush-t-shirt/worn-alt.jpg';
import notYetCapCloseup from '~/assets/mockups/product-stage/not-yet-cap/closeup.jpg';
import notYetCapProduct from '~/assets/mockups/product-stage/not-yet-cap/product.jpg';
import notYetCapWorn from '~/assets/mockups/product-stage/not-yet-cap/worn.jpg';
import notYetCapWornAlt from '~/assets/mockups/product-stage/not-yet-cap/worn-alt.jpg';
import notYetCrewCloseup from '~/assets/mockups/product-stage/not-yet-sweaty/closeup.jpg';
import notYetCrewProduct from '~/assets/mockups/product-stage/not-yet-sweaty/product.jpg';
import notYetCrewWorn from '~/assets/mockups/product-stage/not-yet-sweaty/worn.jpg';
import notYetCrewWornAlt from '~/assets/mockups/product-stage/not-yet-sweaty/worn-alt.jpg';
import notYetTeeCloseup from '~/assets/mockups/product-stage/not-yet-t-shirt/closeup.jpg';
import notYetTeeProduct from '~/assets/mockups/product-stage/not-yet-t-shirt/product.jpg';
import notYetTeeWorn from '~/assets/mockups/product-stage/not-yet-t-shirt/worn.jpg';
import notYetTeeWornAlt from '~/assets/mockups/product-stage/not-yet-t-shirt/worn-alt.jpg';
import sayLessCapCloseup from '~/assets/mockups/product-stage/say-less-cap/closeup.jpg';
import sayLessCapProduct from '~/assets/mockups/product-stage/say-less-cap/product.jpg';
import sayLessCapWorn from '~/assets/mockups/product-stage/say-less-cap/worn.jpg';
import sayLessCapWornAlt from '~/assets/mockups/product-stage/say-less-cap/worn-alt.jpg';
import sayLessHoodieCloseup from '~/assets/mockups/product-stage/say-less-hoodie/closeup.jpg';
import sayLessHoodieProduct from '~/assets/mockups/product-stage/say-less-hoodie/product.jpg';
import sayLessHoodieWorn from '~/assets/mockups/product-stage/say-less-hoodie/worn.jpg';
import sayLessHoodieWornAlt from '~/assets/mockups/product-stage/say-less-hoodie/worn-alt.jpg';
import sayLessTeeCloseup from '~/assets/mockups/product-stage/say-less-t-shirt/closeup.jpg';
import sayLessTeeProduct from '~/assets/mockups/product-stage/say-less-t-shirt/product.jpg';
import sayLessTeeWorn from '~/assets/mockups/product-stage/say-less-t-shirt/worn.jpg';
import sayLessTeeWornAlt from '~/assets/mockups/product-stage/say-less-t-shirt/worn-alt.jpg';

export type ProductStageStill = {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain';
  objectPosition?: string;
};

const LANDSCAPE = {width: 2752, height: 1536, fit: 'cover' as const};

function still(
  id: string,
  url: string,
  alt: string,
  size: {width: number; height: number} = LANDSCAPE,
): ProductStageStill {
  return {id, url, alt, ...size, fit: 'cover'};
}

function stage(
  prefix: string,
  product: string,
  worn: string,
  print: string,
  wornAlt: string,
  alts: [string, string, string, string],
): ProductStageStill[] {
  return [
    still(`${prefix}-product`, product, alts[0]),
    still(`${prefix}-worn`, worn, alts[1]),
    still(`${prefix}-print`, print, alts[2]),
    still(`${prefix}-worn-alt`, wornAlt, alts[3]),
  ];
}

/**
 * Local 16:9 PDP stills, keyed by product handle.
 * Pieces without a set keep the Shopify gallery in a 16:9 crop.
 */
const PRODUCT_STAGE_STILLS: Record<string, ProductStageStill[]> = {
  'no-rush-t-shirt': [
    still(
      'no-rush-tee-product',
      noRushTeeProduct,
      'Sage No Rush tee caught in wind on a brass hanger against dark stone.',
    ),
    still(
      'no-rush-tee-worn',
      noRushTeeWorn,
      'Woman mid-turn in the sage No Rush tee, hair and fabric in motion against stone.',
    ),
    still(
      'no-rush-tee-print',
      noRushTeeCloseup,
      'Close crop of the marble print and No Rush script on the sage tee.',
      {width: 1376, height: 768},
    ),
    still(
      'no-rush-tee-worn-alt',
      noRushTeeWornAlt,
      'Man walking in the sage No Rush tee against a dark stone wall.',
    ),
  ],
  'not-yet-t-shirt': stage(
    'not-yet-tee',
    notYetTeeProduct,
    notYetTeeWorn,
    notYetTeeCloseup,
    notYetTeeWornAlt,
    [
      'Navy Not Yet tee caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the navy Not Yet tee, hair and fabric in motion against stone.',
      'Close crop of the sculptural-hand print and Not Yet script on the navy tee.',
      'Man walking in the navy Not Yet tee against a dark stone wall.',
    ],
  ),
  'say-less-t-shirt': stage(
    'say-less-tee',
    sayLessTeeProduct,
    sayLessTeeWorn,
    sayLessTeeCloseup,
    sayLessTeeWornAlt,
    [
      'Crimson Say Less tee caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the crimson Say Less tee, hair and fabric in motion against stone.',
      'Close crop of the mouth print, gold drip, and Say Less script on the crimson tee.',
      'Man walking in the crimson Say Less tee against a dark stone wall.',
    ],
  ),
  'after-this-t-shirt': stage(
    'after-this-tee',
    afterThisTeeProduct,
    afterThisTeeWorn,
    afterThisTeeCloseup,
    afterThisTeeWornAlt,
    [
      'Bone After This tee caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the bone After This tee, hair and fabric in motion against stone.',
      'Close crop of the satin print, gold droplet, and After This script on the cream tee.',
      'Man walking in the bone After This tee against a dark stone wall.',
    ],
  ),
  'no-rush-sweatshirt': stage(
    'no-rush-crew',
    noRushCrewProduct,
    noRushCrewWorn,
    noRushCrewCloseup,
    noRushCrewWornAlt,
    [
      'Bone No Rush crew caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the bone crew, afterstate wordmark catching the light.',
      'Close crop of the afterstate wordmark on the bone crew.',
      'Man walking in the bone No Rush crew against a dark stone wall.',
    ],
  ),
  'not-yet-sweaty': stage(
    'not-yet-crew',
    notYetCrewProduct,
    notYetCrewWorn,
    notYetCrewCloseup,
    notYetCrewWornAlt,
    [
      'Terracotta Not Yet crew caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the terracotta crew, afterstate wordmark catching the light.',
      'Close crop of the afterstate wordmark on the terracotta crew.',
      'Man walking in the terracotta Not Yet crew against a dark stone wall.',
    ],
  ),
  'say-less-hoodie': stage(
    'say-less-hoodie',
    sayLessHoodieProduct,
    sayLessHoodieWorn,
    sayLessHoodieCloseup,
    sayLessHoodieWornAlt,
    [
      'Navy Say Less hoodie caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the navy hoodie, orange afterstate wordmark catching the light.',
      'Close crop of the orange afterstate wordmark on the navy hoodie.',
      'Man walking in the navy Say Less hoodie against a dark stone wall.',
    ],
  ),
  'after-this-hoodie': stage(
    'after-this-hoodie',
    afterThisHoodieProduct,
    afterThisHoodieWorn,
    afterThisHoodieCloseup,
    afterThisHoodieWornAlt,
    [
      'Forest After This hoodie caught in wind on a brass hanger against dark stone.',
      'Woman mid-turn in the forest hoodie, mustard afterstate wordmark catching the light.',
      'Close crop of the mustard afterstate wordmark on the forest hoodie.',
      'Man walking in the forest After This hoodie against a dark stone wall.',
    ],
  ),
  'no-rush-cap': stage(
    'no-rush-cap',
    noRushCapProduct,
    noRushCapWorn,
    noRushCapCloseup,
    noRushCapWornAlt,
    [
      'Forest No Rush cap hanging from a brass hook against dark stone.',
      'Woman looking back over her shoulder in the forest cap, yellow afterstate on the side.',
      'Close crop of the yellow afterstate embroidery on the forest cap.',
      'Man walking in the forest No Rush cap against a dark stone wall.',
    ],
  ),
  'not-yet-cap': stage(
    'not-yet-cap',
    notYetCapProduct,
    notYetCapWorn,
    notYetCapCloseup,
    notYetCapWornAlt,
    [
      'Navy Not Yet cap hanging from a brass hook against dark stone.',
      'Woman looking back over her shoulder in the navy cap, orange afterstate on the side.',
      'Close crop of the orange afterstate embroidery on the navy cap.',
      'Man walking in the navy Not Yet cap against a dark stone wall.',
    ],
  ),
  'say-less-cap': stage(
    'say-less-cap',
    sayLessCapProduct,
    sayLessCapWorn,
    sayLessCapCloseup,
    sayLessCapWornAlt,
    [
      'Burgundy Say Less cap hanging from a brass hook against dark stone.',
      'Woman looking back over her shoulder in the burgundy cap, white afterstate on the side.',
      'Close crop of the white afterstate embroidery on the burgundy cap.',
      'Man walking in the burgundy Say Less cap against a dark stone wall.',
    ],
  ),
  'after-this-cap': stage(
    'after-this-cap',
    afterThisCapProduct,
    afterThisCapWorn,
    afterThisCapCloseup,
    afterThisCapWornAlt,
    [
      'Bone After This cap hanging from a brass hook against dark stone.',
      'Woman looking back over her shoulder in the bone cap, navy afterstate on the side.',
      'Close crop of the navy afterstate embroidery on the bone cap.',
      'Man walking in the bone After This cap against a dark stone wall.',
    ],
  ),
};

export function hasProductStageStills(handle?: string | null): boolean {
  return Boolean(handle && PRODUCT_STAGE_STILLS[handle]?.length);
}

export function getProductStageStills(
  handle: string | undefined,
  gallery: ProductMediaItem[],
  title?: string | null,
): ProductStageStill[] {
  const local = handle ? PRODUCT_STAGE_STILLS[handle] : undefined;
  if (local?.length) return local;
  return galleryToStageStills(gallery, title);
}

function galleryToStageStills(
  gallery: ProductMediaItem[],
  title?: string | null,
): ProductStageStill[] {
  const stills: ProductStageStill[] = [];
  const seen = new Set<string>();

  for (const item of gallery) {
    if (item.mediaContentType !== 'IMAGE' || !item.image?.url) continue;
    if (seen.has(item.image.url)) continue;
    seen.add(item.image.url);
    stills.push({
      id: item.id,
      url: item.image.url,
      alt: item.alt || item.image.altText || title || '',
      width: item.image.width ?? undefined,
      height: item.image.height ?? undefined,
      fit: 'cover',
      objectPosition: 'center 30%',
    });
  }

  return stills;
}
