import {
  FACEBOOK_HREF,
  FACEBOOK_LABEL,
  INSTAGRAM_HREF,
  INSTAGRAM_LABEL,
  LINKEDIN_HREF,
  LINKEDIN_LABEL,
} from '~/lib/social';
import styles from './SocialLinks.module.css';

type SocialLinksProps = {
  className?: string;
  onNavigate?: () => void;
};

const SOCIALS = [
  {
    href: FACEBOOK_HREF,
    label: FACEBOOK_LABEL,
    icon: FacebookIcon,
  },
  {
    href: INSTAGRAM_HREF,
    label: INSTAGRAM_LABEL,
    icon: InstagramIcon,
  },
  {
    href: LINKEDIN_HREF,
    label: LINKEDIN_LABEL,
    icon: LinkedInIcon,
  },
] as const;

/**
 * Compact social row — Facebook, Instagram, LinkedIn.
 */
export function SocialLinks({className, onNavigate}: SocialLinksProps) {
  return (
    <ul
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Connect"
    >
      {SOCIALS.map((social) => {
        const Icon = social.icon;

        return (
          <li key={social.href}>
            <a
              className={styles.link}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              onClick={onNavigate}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.25h2.75V5.5H14.5c-2.35 0-4.25 1.9-4.25 4.25v1.75H8v2.75h2.25V20.5h2.75v-6.25h2.4l.6-2.75h-3V9.75c0-.83.67-1.5 1.5-1.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8.15" cy="8.15" r="1" fill="currentColor" />
      <path
        d="M8.15 10.4v6.1M11.55 16.5V10.4M11.55 12.15c.5-.8 1.25-1.2 2.15-1.2 1.3 0 2.15.95 2.15 2.5V16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
