import type {ReactNode} from 'react';
import campaignLook from '~/assets/mockups/campaign-look-new.jpg';
import journalOnNoRush from '~/assets/mockups/campaign-look-alt.jpg';
import journalBeyondRush from '~/assets/mockups/campaign-look.jpg';
import journalQuietClothing from '~/assets/mockups/lookbook-01.jpg';
import {Marquee} from '~/components/motion/Marquee';
import {CampaignLook} from './CampaignLook';
import {LandingHero} from './LandingHero';
import {StreetwearMockups} from './StreetwearMockups';
import {renderHomepageSection} from './registry';
import type {HomepageSection, ProductRowSection} from './types';

export type HomepageSectionsProps = {
  sections?: HomepageSection[] | null;
  /** Product cards (or other nodes) injected into the default product_row */
  products?: ReactNode;
  className?: string;
};

/**
 * Premium logo-led homepage when CMS sections are empty.
 */
export function buildDefaultHomepageSections(
  products?: ReactNode,
): HomepageSection[] {
  const productRow: ProductRowSection = {
    id: 'default-product-row',
    type: 'product_row',
    eyebrow: 'Limited collection',
    title: 'Afterstate 001 — No Rush',
    ctaLabel: 'View limited drop',
    ctaTo: '/collections/afterstate-001',
    children: products,
  };

  return [
    productRow,
    {
      id: 'default-journal',
      type: 'journal_articles',
      eyebrow: 'Journal',
      title: 'From the journal',
      articles: [
        {
          id: 'journal-no-rush',
          to: '/journal/no-rush',
          title: 'On No Rush',
          eyebrow: 'Origin',
          excerpt:
            'How Afterstate began — not with a drop calendar, but with a refusal to hurry clothes into the world.',
          image: {
            id: 'journal-no-rush-image',
            url: journalOnNoRush,
            altText:
              'Model in Afterstate 001 No Rush campaign hoodie at dusk',
            width: 1200,
            height: 900,
          },
        },
        {
          id: 'journal-beyond',
          to: '/journal/life-beyond-the-rush',
          title: 'Life beyond the rush',
          eyebrow: 'Notes',
          excerpt:
            'A longer note on pace, wardrobe, and the quiet decision to own less — and wear it harder.',
          image: {
            id: 'journal-beyond-image',
            url: journalBeyondRush,
            altText: 'Afterstate campaign look in quiet evening light',
            width: 1200,
            height: 900,
          },
        },
        {
          id: 'journal-quiet-clothing',
          to: '/journal/the-weight-of-quiet-clothing',
          title: 'The weight of quiet clothing',
          eyebrow: 'Materials',
          excerpt:
            'Heavy cotton, brushed fleece, and the small decisions that decide how a piece ages on your body.',
          image: {
            id: 'journal-quiet-clothing-image',
            url: journalQuietClothing,
            altText:
              'Close look at Afterstate muted teal outerwear fabric and AS mark',
            width: 1200,
            height: 900,
          },
        },
      ],
    },
    {
      id: 'default-closing',
      type: 'closing_statement',
      brand: 'Afterstate',
      tagline: 'Life beyond the rush.',
      body: 'Every piece is limited edition. Short runs. No restocks.',
    },
  ];
}

/**
 * Renders a CMS-driven homepage section list, or the default Afterstate
 * composition when the array is empty / missing.
 */
export function HomepageSections({
  sections,
  products,
  className,
}: HomepageSectionsProps) {
  const hasCmsSections = Boolean(sections && sections.length > 0);
  const resolved = hasCmsSections
    ? sections!
    : buildDefaultHomepageSections(products);

  if (!hasCmsSections) {
    return (
      <div className={className}>
        <LandingHero />
        <Marquee />
        <CampaignLook imageSrc={campaignLook} />
        <StreetwearMockups />
        {resolved.map((section) => (
          <div key={section.id} data-section-type={section.type}>
            {renderHomepageSection(section)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {resolved.map((section) => (
        <div key={section.id} data-section-type={section.type}>
          {renderHomepageSection(section)}
        </div>
      ))}
    </div>
  );
}
