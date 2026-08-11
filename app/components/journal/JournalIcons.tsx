import type {ReactNode, SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement> & {title?: string};

function BaseIcon({title, children, ...props}: IconProps & {children: ReactNode}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="1.5rem"
      height="1.5rem"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconLimited(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="16" cy="16" r="10" />
      <path d="M16 10v6l4 2" />
    </BaseIcon>
  );
}

export function IconFabric(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 9h18v14H7z" />
      <path d="M7 14h18M12 9v14M20 9v14" />
    </BaseIcon>
  );
}

export function IconPace(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 22c4-10 8-14 10-14s6 4 10 14" />
      <path d="M11 18h10" />
    </BaseIcon>
  );
}

export function IconStitch(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 8l16 16M24 8L8 24" />
      <path d="M16 6v4M16 22v4M6 16h4M22 16h4" />
    </BaseIcon>
  );
}

export function IconMark(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M10 22V10h5.2c2.6 0 4.3 1.5 4.3 3.7 0 2.3-1.7 3.8-4.3 3.8H13" />
      <path d="M13 17.5L22 22" />
    </BaseIcon>
  );
}

export function IconVoice(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 12h8a4 4 0 014 4v2a4 4 0 01-4 4h-2l-4 3v-3H8a4 4 0 01-4-4v-2a4 4 0 014-4z" />
      <path d="M12 15.5h4M12 18h2.5" />
    </BaseIcon>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 16h16M17 10l6 6-6 6" />
    </BaseIcon>
  );
}

export const JOURNAL_ICON_MAP = {
  limited: IconLimited,
  fabric: IconFabric,
  pace: IconPace,
  stitch: IconStitch,
  mark: IconMark,
  voice: IconVoice,
} as const;

export type JournalIconName = keyof typeof JOURNAL_ICON_MAP;
