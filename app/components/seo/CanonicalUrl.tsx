import type {AlternateLanguage} from '~/lib/seo';

export type CanonicalUrlProps = {
  href: string;
};

/**
 * Renders a canonical link tag for the document head.
 * Prefer returning this from a route `links` / `meta` export when possible.
 */
export function CanonicalUrl({href}: CanonicalUrlProps) {
  return <link rel="canonical" href={href} />;
}

export type AlternateLanguageLinksProps = {
  languages: AlternateLanguage[];
};

/**
 * hreflang alternate links for multi-market Afterstate storefronts.
 */
export function AlternateLanguageLinks({
  languages,
}: AlternateLanguageLinksProps) {
  if (!languages.length) return null;

  return (
    <>
      {languages.map((lang) => (
        <link
          key={`${lang.hreflang}-${lang.href}`}
          rel="alternate"
          hrefLang={lang.hreflang}
          href={lang.href}
        />
      ))}
    </>
  );
}

/**
 * Build link descriptors for React Router `links` exports.
 */
export function buildCanonicalLinkDescriptor(href: string) {
  return {rel: 'canonical', href};
}

export function buildAlternateLanguageLinkDescriptors(
  languages: AlternateLanguage[],
) {
  return languages.map((lang) => ({
    rel: 'alternate',
    hrefLang: lang.hreflang,
    href: lang.href,
  }));
}
