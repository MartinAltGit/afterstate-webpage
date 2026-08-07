import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import styles from './ProductMedia.module.css';

export type ProductMediaItem =
  | {
      mediaContentType: 'IMAGE';
      id: string;
      alt?: string | null;
      image: Pick<ImageType, 'id' | 'url' | 'altText' | 'width' | 'height'> | null;
    }
  | {
      mediaContentType: 'VIDEO' | 'EXTERNAL_VIDEO';
      id: string;
      alt?: string | null;
      sources?: Array<{url: string; mimeType?: string | null}>;
      embedUrl?: string | null;
      previewImage?: Pick<
        ImageType,
        'id' | 'url' | 'altText' | 'width' | 'height'
      > | null;
    };

export type ProductMediaProps = {
  media: ProductMediaItem;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * Single product media unit — image or video.
 * When `priority` is true, images load eagerly (main gallery media).
 */
export function ProductMedia({
  media,
  priority = false,
  className,
  sizes = '(min-width: 45em) 50vw, 100vw',
}: ProductMediaProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  if (media.mediaContentType === 'IMAGE') {
    if (!media.image?.url) {
      return <div className={rootClass} aria-hidden="true" />;
    }

    return (
      <div className={rootClass}>
        <Image
          data={media.image}
          alt={media.alt || media.image.altText || ''}
          aspectRatio="3/4"
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          className={styles.image}
        />
      </div>
    );
  }

  const videoSources = media.sources?.filter((s) => s.url) ?? [];

  if (videoSources.length > 0) {
    return (
      <div className={rootClass}>
        <video
          className={styles.video}
          controls
          playsInline
          preload={priority ? 'metadata' : 'none'}
          poster={media.previewImage?.url}
          aria-label={media.alt || 'Product video'}
        >
          {/* Captions intentionally omitted for silent product media; aria-label provides a name. */}
          <track kind="captions" />
          {videoSources.map((source) => (
            <source
              key={source.url}
              src={source.url}
              type={source.mimeType || undefined}
            />
          ))}
        </video>
      </div>
    );
  }

  if (media.embedUrl) {
    return (
      <div className={rootClass}>
        <iframe
          className={styles.embed}
          src={media.embedUrl}
          title={media.alt || 'Product video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (media.previewImage?.url) {
    return (
      <div className={rootClass}>
        <Image
          data={media.previewImage}
          alt={media.alt || media.previewImage.altText || ''}
          aspectRatio="3/4"
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          className={styles.image}
        />
      </div>
    );
  }

  return <div className={rootClass} aria-hidden="true" />;
}
