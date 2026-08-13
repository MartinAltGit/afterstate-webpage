import type {ProductMediaItem} from '~/components/commerce/ProductMedia';
import type {MetafieldImage} from '~/lib/metafields';

type MediaImageLike = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type RawMediaNode = {
  __typename?: string;
  id?: string | null;
  alt?: string | null;
  mediaContentType?: string | null;
  image?: MediaImageLike | null;
  previewImage?: MediaImageLike | null;
  sources?: Array<{url?: string | null; mimeType?: string | null}> | null;
  embedUrl?: string | null;
  originUrl?: string | null;
};

type ProductMediaSource = {
  title?: string | null;
  featuredImage?: MediaImageLike | null;
  media?: {
    nodes?: Array<RawMediaNode | null> | null;
  } | null;
};

/**
 * Build ordered PDP gallery items: selected variant image, Shopify media,
 * then editorial metafield images. Dedupes by URL.
 */
export function buildGalleryMedia(
  product: ProductMediaSource,
  selectedVariant: {image?: MediaImageLike | null} | null,
  editorialMedia: MetafieldImage[] = [],
): ProductMediaItem[] {
  const items: ProductMediaItem[] = [];
  const seen = new Set<string>();

  const pushImage = (image: MediaImageLike | null | undefined, alt?: string | null) => {
    if (!image?.url || seen.has(image.url)) return;
    seen.add(image.url);
    items.push({
      mediaContentType: 'IMAGE',
      id: image.id || image.url,
      alt: alt || image.altText || product.title || '',
      image: {
        id: image.id ?? undefined,
        url: image.url,
        altText: image.altText,
        width: image.width,
        height: image.height,
      },
    });
  };

  const pushNode = (node: RawMediaNode | null | undefined) => {
    if (!node) return;
    const type = node.mediaContentType || node.__typename;

    if (type === 'IMAGE' || type === 'MediaImage' || node.image?.url) {
      pushImage(node.image, node.alt);
      return;
    }

    if (type === 'VIDEO' || type === 'Video') {
      const sources =
        node.sources
          ?.filter((s): s is {url: string; mimeType?: string | null} => Boolean(s?.url))
          .map((s) => ({url: s.url, mimeType: s.mimeType})) ?? [];
      const key = sources[0]?.url || node.previewImage?.url || node.id;
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push({
        mediaContentType: 'VIDEO',
        id: node.id || key,
        alt: node.alt || product.title,
        sources,
        previewImage: node.previewImage
          ? {
              id: node.previewImage.id ?? undefined,
              url: node.previewImage.url,
              altText: node.previewImage.altText,
              width: node.previewImage.width,
              height: node.previewImage.height,
            }
          : null,
      });
      return;
    }

    if (type === 'EXTERNAL_VIDEO' || type === 'ExternalVideo') {
      const key = node.embedUrl || node.originUrl || node.id;
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push({
        mediaContentType: 'EXTERNAL_VIDEO',
        id: node.id || key,
        alt: node.alt || product.title,
        embedUrl: node.embedUrl,
        previewImage: node.previewImage
          ? {
              id: node.previewImage.id ?? undefined,
              url: node.previewImage.url,
              altText: node.previewImage.altText,
              width: node.previewImage.width,
              height: node.previewImage.height,
            }
          : null,
      });
    }
  };

  pushImage(selectedVariant?.image);
  pushImage(product.featuredImage);

  for (const node of product.media?.nodes ?? []) {
    pushNode(node);
  }

  for (const img of editorialMedia) {
    pushImage(img);
  }

  return items;
}
