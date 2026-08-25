import type {ShopCatalogImage, ShopCatalogProduct} from '~/lib/shop-catalog';
import {getCatalogImage} from '~/lib/shop-catalog';
import afterThisCap from '~/assets/mockups/shop-thumbs/after-this-cap.jpg';
import afterThisHoodie from '~/assets/mockups/shop-thumbs/after-this-hoodie.jpg';
import afterThisTee from '~/assets/mockups/shop-thumbs/after-this-t-shirt.jpg';
import noRushCap from '~/assets/mockups/shop-thumbs/no-rush-cap.jpg';
import noRushSweatshirt from '~/assets/mockups/shop-thumbs/no-rush-sweatshirt.jpg';
import noRushTee from '~/assets/mockups/shop-thumbs/no-rush-t-shirt.jpg';
import notYetCap from '~/assets/mockups/shop-thumbs/not-yet-cap.jpg';
import notYetSweaty from '~/assets/mockups/shop-thumbs/not-yet-sweaty.jpg';
import notYetTee from '~/assets/mockups/shop-thumbs/not-yet-t-shirt.jpg';
import sayLessCap from '~/assets/mockups/shop-thumbs/say-less-cap.jpg';
import sayLessHoodie from '~/assets/mockups/shop-thumbs/say-less-hoodie.jpg';
import sayLessTee from '~/assets/mockups/shop-thumbs/say-less-t-shirt.jpg';

export type ShopCardStill = ShopCatalogImage & {url: string};

type CardRatio = 'portrait' | 'tall' | 'square';

function still(url: string, ratio: CardRatio = 'portrait'): ShopCardStill {
  const size =
    ratio === 'square'
      ? {width: 1536, height: 1536}
      : ratio === 'tall'
        ? {width: 1248, height: 1872}
        : {width: 1328, height: 1760};

  return {
    url,
    altText: '',
    ...size,
  };
}

/**
 * Tight shop thumbnails, keyed by product handle.
 * Pieces without a still keep the live Shopify garment cutout.
 */
const SHOP_CARD_STILLS: Record<string, ShopCardStill> = {
  'after-this-cap': still(afterThisCap, 'square'),
  'after-this-hoodie': still(afterThisHoodie, 'tall'),
  'after-this-t-shirt': still(afterThisTee, 'portrait'),
  'no-rush-cap': still(noRushCap, 'square'),
  'no-rush-sweatshirt': still(noRushSweatshirt, 'tall'),
  'no-rush-t-shirt': still(noRushTee, 'portrait'),
  'not-yet-cap': still(notYetCap, 'square'),
  'not-yet-sweaty': still(notYetSweaty, 'tall'),
  'not-yet-t-shirt': still(notYetTee, 'portrait'),
  'say-less-cap': still(sayLessCap, 'square'),
  'say-less-hoodie': still(sayLessHoodie, 'tall'),
  'say-less-t-shirt': still(sayLessTee, 'portrait'),
};

export function getShopCardStill(handle?: string | null): ShopCardStill | null {
  if (!handle) return null;
  return SHOP_CARD_STILLS[handle] ?? null;
}

export function getShopCardImage(product: ShopCatalogProduct): ShopCatalogImage | null {
  return getShopCardStill(product.handle) ?? getCatalogImage(product);
}

export function isShopCardStill(handle?: string | null): boolean {
  return Boolean(getShopCardStill(handle));
}
