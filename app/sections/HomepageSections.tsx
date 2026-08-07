import type {ReactNode} from 'react';
import {renderHomepageSection} from './registry';
import type {HomepageSection, ProductRowSection} from './types';

export type HomepageSectionsProps = {
  sections?: HomepageSection[] | null;
  /** Product cards (or other nodes) injected into the default product_row */
  products?: ReactNode;
  className?: string;
};

/**
 * Deliberate Afterstate wireframe homepage when CMS sections are empty.
 * Brand-first opening, campaign intro, product row, journal, closing —
 * not the Hydrogen featured-collection starter demo.
 */
export function buildDefaultHomepageSections(
  products?: ReactNode,
): HomepageSection[] {
  const productRow: ProductRowSection = {
    id: 'default-product-row',
    type: 'product_row',
    eyebrow: 'Shop',
    title: 'Afterstate 001 — No Rush',
    ctaLabel: 'View collection',
    ctaTo: '/collections/afterstate-001',
    children: products,
  };

  return [
    {
      id: 'default-opening',
      type: 'opening_statement',
      brand: 'Afterstate',
      tagline: 'Life beyond the rush.',
    },
    {
      id: 'default-campaign',
      type: 'campaign_hero',
      eyebrow: 'Campaign',
      title: 'Afterstate 001: No Rush',
      subtitle:
        'The first Afterstate collection — clothes for a slower, clearer pace.',
      ctaLabel: 'Enter the campaign',
      ctaTo: '/collections/afterstate-001',
    },
    productRow,
    {
      id: 'default-journal',
      type: 'journal_articles',
      eyebrow: 'Journal',
      title: 'From the journal',
      articles: [
        {
          id: 'journal-no-rush',
          to: '/blogs/journal/no-rush',
          title: 'On No Rush',
          eyebrow: 'Campaign',
          excerpt:
            'Why Afterstate starts with fewer pieces and more room to live in them.',
        },
        {
          id: 'journal-beyond',
          to: '/blogs/journal/life-beyond-the-rush',
          title: 'Life beyond the rush',
          eyebrow: 'Notes',
          excerpt: 'A short note on pace, wardrobe, and what lasts.',
        },
      ],
    },
    {
      id: 'default-closing',
      type: 'closing_statement',
      brand: 'Afterstate',
      tagline: 'Life beyond the rush.',
      body: 'Fewer drops. Clearer intent. Clothes made to stay.',
    },
  ];
}

/**
 * Renders a CMS-driven homepage section list, or the default Afterstate
 * wireframe composition when the array is empty / missing.
 */
export function HomepageSections({
  sections,
  products,
  className,
}: HomepageSectionsProps) {
  const resolved =
    sections && sections.length > 0
      ? sections
      : buildDefaultHomepageSections(products);

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
