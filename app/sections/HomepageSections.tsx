import journalOnNoRush from '~/assets/mockups/campaign-look-alt.jpg';
import journalBeyondRush from '~/assets/mockups/campaign-look.jpg';
import journalQuietClothing from '~/assets/mockups/lookbook-01.jpg';
import type {CollectionGridProduct} from '~/components/collection/CollectionProductGrid';
import {Reveal} from '~/components/motion/Reveal';
import {LandingCollections} from './LandingCollections';
import {LandingHero} from './LandingHero';
import {LandingProducts} from './LandingProducts';
import {StreetwearMockups} from './StreetwearMockups';
import {TrustStrip} from './TrustStrip';
import {WelcomeBand} from './WelcomeBand';
import {renderHomepageSection} from './registry';
import type {HomepageSection} from './types';

export type HomepageSectionsProps = {
  sections?: HomepageSection[] | null;
  products?: CollectionGridProduct[] | null;
  className?: string;
};

/** Heroes / blocks that already animate on their own */
const SELF_ANIMATED = new Set<HomepageSection['type']>([
  'campaign_hero',
  'opening_statement',
  'closing_statement',
  'quote',
]);

/**
 * Logo-led homepage when CMS sections are empty — products, collections, wardrobe.
 */
export function buildDefaultHomepageSections(): HomepageSection[] {
  return [
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
              'Model in Afterstate 001 No Rush cream crew and forest cap',
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
            altText: 'Model in Afterstate After This cream tee and bone cap',
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
              'Two models in Afterstate After This cream tee and forest hoodie',
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

function SectionReveal({
  section,
  index,
}: {
  section: HomepageSection;
  index: number;
}) {
  const content = (
    <div data-section-type={section.type}>{renderHomepageSection(section)}</div>
  );

  if (SELF_ANIMATED.has(section.type)) {
    return <div key={section.id}>{content}</div>;
  }

  return (
    <Reveal key={section.id} delayMs={Math.min(index, 6) * 90}>
      {content}
    </Reveal>
  );
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
    : buildDefaultHomepageSections();

  if (!hasCmsSections) {
    const story = resolved.filter(
      (section) => section.type !== 'closing_statement',
    );
    const closing = resolved.filter(
      (section) => section.type === 'closing_statement',
    );

    return (
      <div className={className}>
        <LandingHero />
        <TrustStrip />
        <LandingProducts products={products} />
        <LandingCollections />
        <StreetwearMockups />
        {story.map((section, index) => (
          <SectionReveal key={section.id} section={section} index={index} />
        ))}
        <WelcomeBand />
        {closing.map((section, index) => (
          <SectionReveal key={section.id} section={section} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {resolved.map((section, index) => (
        <SectionReveal key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
