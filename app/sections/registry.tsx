import type {ComponentType} from 'react';
import {CampaignHero} from '~/components/content/CampaignHero';
import {EditorialImage} from '~/components/content/EditorialImage';
import {EditorialText} from '~/components/content/EditorialText';
import {EditorialVideo} from '~/components/content/EditorialVideo';
import {LookbookSequence} from '~/components/content/LookbookSequence';
import {ManifestoBlock} from '~/components/content/ManifestoBlock';
import {NewsletterForm} from '~/components/content/NewsletterForm';
import {ProductRow} from '~/components/content/ProductRow';
import {QuoteBlock} from '~/components/content/QuoteBlock';
import {SplitMediaText} from '~/components/content/SplitMediaText';
import {JournalArticles} from './JournalArticles';
import {OpeningStatement} from './OpeningStatement';
import type {HomepageSection, HomepageSectionType} from './types';

type SectionRendererProps = {
  section: HomepageSection;
};

function renderOpeningStatement({section}: SectionRendererProps) {
  if (section.type !== 'opening_statement') return null;
  return <OpeningStatement section={section} />;
}

function renderClosingStatement({section}: SectionRendererProps) {
  if (section.type !== 'closing_statement') return null;
  return <OpeningStatement section={section} />;
}

function renderCampaignHero({section}: SectionRendererProps) {
  if (section.type !== 'campaign_hero') return null;
  return (
    <CampaignHero
      eyebrow={section.eyebrow}
      title={section.title}
      subtitle={section.subtitle}
      ctaLabel={section.ctaLabel}
      ctaTo={section.ctaTo}
      image={section.image}
    />
  );
}

function renderCampaignFilm({section}: SectionRendererProps) {
  if (section.type !== 'campaign_film') return null;
  return (
    <EditorialVideo
      src={section.src}
      poster={section.poster}
      caption={section.caption}
      title={section.title}
    />
  );
}

function renderFullWidthImage({section}: SectionRendererProps) {
  if (section.type !== 'full_width_image') return null;
  return (
    <EditorialImage
      image={section.image}
      caption={section.caption}
      alt={section.alt}
      fullBleed
    />
  );
}

function renderFullWidthVideo({section}: SectionRendererProps) {
  if (section.type !== 'full_width_video') return null;
  return (
    <EditorialVideo
      src={section.src}
      poster={section.poster}
      caption={section.caption}
      title={section.title}
      fullBleed
    />
  );
}

function renderSplitMediaText({section}: SectionRendererProps) {
  if (section.type !== 'split_media_text') return null;
  return (
    <SplitMediaText
      eyebrow={section.eyebrow}
      title={section.title}
      ctaLabel={section.ctaLabel}
      ctaTo={section.ctaTo}
      image={section.image}
      mediaPosition={section.mediaPosition}
    >
      {section.body}
    </SplitMediaText>
  );
}

function renderEditorialText({section}: SectionRendererProps) {
  if (section.type !== 'editorial_text') return null;
  return (
    <EditorialText
      eyebrow={section.eyebrow}
      title={section.title}
      align={section.align}
    >
      {section.body}
    </EditorialText>
  );
}

function renderProductRow({section}: SectionRendererProps) {
  if (section.type !== 'product_row') return null;
  return (
    <ProductRow
      eyebrow={section.eyebrow}
      title={section.title}
      ctaLabel={section.ctaLabel}
      ctaTo={section.ctaTo}
    >
      {section.children}
    </ProductRow>
  );
}

function renderProductFeature({section}: SectionRendererProps) {
  if (section.type !== 'product_feature') return null;
  return (
    <SplitMediaText
      eyebrow={section.eyebrow ?? 'Product'}
      title={section.title}
      ctaLabel={section.ctaLabel}
      ctaTo={section.ctaTo}
      image={section.image}
      mediaPosition={section.mediaPosition ?? 'right'}
    >
      {section.body}
    </SplitMediaText>
  );
}

function renderCollectionIntroduction({section}: SectionRendererProps) {
  if (section.type !== 'collection_introduction') return null;
  return (
    <EditorialText
      eyebrow={section.eyebrow ?? 'Collection'}
      title={section.title}
      align={section.align ?? 'center'}
    >
      {section.body}
    </EditorialText>
  );
}

function renderCollectionManifesto({section}: SectionRendererProps) {
  if (section.type !== 'collection_manifesto') return null;
  return (
    <ManifestoBlock label={section.label}>{section.body}</ManifestoBlock>
  );
}

function renderLookbookSequence({section}: SectionRendererProps) {
  if (section.type !== 'lookbook_sequence') return null;
  return (
    <LookbookSequence
      eyebrow={section.eyebrow}
      title={section.title}
      frames={section.frames}
    />
  );
}

function renderQuote({section}: SectionRendererProps) {
  if (section.type !== 'quote') return null;
  return (
    <QuoteBlock quote={section.quote} attribution={section.attribution} />
  );
}

function renderJournalArticles({section}: SectionRendererProps) {
  if (section.type !== 'journal_articles') return null;
  return <JournalArticles section={section} />;
}

function renderMaterialFeature({section}: SectionRendererProps) {
  if (section.type !== 'material_feature') return null;
  return (
    <SplitMediaText
      eyebrow={section.eyebrow ?? 'Material'}
      title={section.title}
      ctaLabel={section.ctaLabel}
      ctaTo={section.ctaTo}
      image={section.image}
      mediaPosition={section.mediaPosition}
    >
      {section.body}
    </SplitMediaText>
  );
}

function renderNewsletter({section}: SectionRendererProps) {
  if (section.type !== 'newsletter') return null;
  return (
    <NewsletterForm
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    />
  );
}

/**
 * Maps homepage section type → React renderer.
 */
export const homepageSectionRegistry: Record<
  HomepageSectionType,
  ComponentType<SectionRendererProps>
> = {
  opening_statement: renderOpeningStatement,
  campaign_hero: renderCampaignHero,
  campaign_film: renderCampaignFilm,
  full_width_image: renderFullWidthImage,
  full_width_video: renderFullWidthVideo,
  split_media_text: renderSplitMediaText,
  editorial_text: renderEditorialText,
  product_row: renderProductRow,
  product_feature: renderProductFeature,
  collection_introduction: renderCollectionIntroduction,
  collection_manifesto: renderCollectionManifesto,
  lookbook_sequence: renderLookbookSequence,
  quote: renderQuote,
  journal_articles: renderJournalArticles,
  material_feature: renderMaterialFeature,
  newsletter: renderNewsletter,
  closing_statement: renderClosingStatement,
};

export function renderHomepageSection(section: HomepageSection) {
  const Renderer = homepageSectionRegistry[section.type];
  if (!Renderer) return null;
  return <Renderer section={section} />;
}
