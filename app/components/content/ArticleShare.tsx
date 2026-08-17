import {useState} from 'react';
import styles from './ArticleShare.module.css';

export type ArticleShareProps = {
  url: string;
  title: string;
  imageUrl?: string | null;
  className?: string;
};

function shareHref(
  network: 'x' | 'facebook' | 'pinterest' | 'linkedin',
  url: string,
  title: string,
  imageUrl?: string | null,
) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (network) {
    case 'x':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}${
        imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''
      }`;
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
  }
}

/**
 * Share an article to common networks, plus copy-link.
 */
export function ArticleShare({
  url,
  title,
  imageUrl,
  className,
}: ArticleShareProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <p className={styles.kicker}>Share</p>
      <ul className={styles.list}>
        <li>
          <a
            href={shareHref('x', url, title)}
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>
        </li>
        <li>
          <a
            href={shareHref('facebook', url, title)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </li>
        <li>
          <a
            href={shareHref('pinterest', url, title, imageUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pinterest
          </a>
        </li>
        <li>
          <a
            href={shareHref('linkedin', url, title)}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <button type="button" onClick={copyLink}>
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </li>
      </ul>
    </div>
  );
}
