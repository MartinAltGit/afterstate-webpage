import type {ReactNode} from 'react';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import type {LookbookFrame} from '~/components/content/LookbookSequence';

/**
 * Canonical homepage / landing section types for Afterstate CMS wiring.
 */
export type HomepageSectionType =
  | 'opening_statement'
  | 'campaign_hero'
  | 'campaign_film'
  | 'full_width_image'
  | 'full_width_video'
  | 'split_media_text'
  | 'editorial_text'
  | 'product_row'
  | 'product_feature'
  | 'collection_introduction'
  | 'collection_manifesto'
  | 'lookbook_sequence'
  | 'quote'
  | 'journal_articles'
  | 'material_feature'
  | 'newsletter'
  | 'closing_statement';

export type EditorialImageRef = Pick<
  ImageType,
  'id' | 'url' | 'altText' | 'width' | 'height'
> | null;

export type HomepageSectionBase = {
  id: string;
  type: HomepageSectionType;
};

export type OpeningStatementSection = HomepageSectionBase & {
  type: 'opening_statement';
  brand?: string;
  tagline?: string;
  body?: string;
};

export type CampaignHeroSection = HomepageSectionBase & {
  type: 'campaign_hero';
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaTo?: string;
  image?: EditorialImageRef;
};

export type CampaignFilmSection = HomepageSectionBase & {
  type: 'campaign_film';
  src?: string | null;
  poster?: string | null;
  caption?: string;
  title?: string;
};

export type FullWidthImageSection = HomepageSectionBase & {
  type: 'full_width_image';
  image?: EditorialImageRef;
  caption?: string;
  alt?: string;
};

export type FullWidthVideoSection = HomepageSectionBase & {
  type: 'full_width_video';
  src?: string | null;
  poster?: string | null;
  caption?: string;
  title?: string;
};

export type SplitMediaTextSection = HomepageSectionBase & {
  type: 'split_media_text';
  eyebrow?: string;
  title?: string;
  body?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
  image?: EditorialImageRef;
  mediaPosition?: 'left' | 'right';
};

export type EditorialTextSection = HomepageSectionBase & {
  type: 'editorial_text';
  eyebrow?: string;
  title?: string;
  body?: ReactNode;
  align?: 'start' | 'center';
};

export type ProductRowSection = HomepageSectionBase & {
  type: 'product_row';
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
  ctaTo?: string;
  /** Slot for product cards from the route loader */
  children?: ReactNode;
};

export type ProductFeatureSection = HomepageSectionBase & {
  type: 'product_feature';
  eyebrow?: string;
  title?: string;
  body?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
  image?: EditorialImageRef;
  mediaPosition?: 'left' | 'right';
};

export type CollectionIntroductionSection = HomepageSectionBase & {
  type: 'collection_introduction';
  eyebrow?: string;
  title?: string;
  body?: ReactNode;
  align?: 'start' | 'center';
};

export type CollectionManifestoSection = HomepageSectionBase & {
  type: 'collection_manifesto';
  label?: string;
  body?: ReactNode;
};

export type LookbookSequenceSection = HomepageSectionBase & {
  type: 'lookbook_sequence';
  eyebrow?: string;
  title?: string;
  frames?: LookbookFrame[];
};

export type QuoteSection = HomepageSectionBase & {
  type: 'quote';
  quote?: string;
  attribution?: string;
};

export type JournalArticleTeaser = {
  id: string;
  to: string;
  title: string;
  eyebrow?: string;
  excerpt?: string;
  image?: EditorialImageRef;
};

export type JournalArticlesSection = HomepageSectionBase & {
  type: 'journal_articles';
  eyebrow?: string;
  title?: string;
  articles?: JournalArticleTeaser[];
};

export type MaterialFeatureSection = HomepageSectionBase & {
  type: 'material_feature';
  eyebrow?: string;
  title?: string;
  body?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
  image?: EditorialImageRef;
  mediaPosition?: 'left' | 'right';
};

export type NewsletterSection = HomepageSectionBase & {
  type: 'newsletter';
  eyebrow?: string;
  title?: string;
  description?: string;
};

export type ClosingStatementSection = HomepageSectionBase & {
  type: 'closing_statement';
  brand?: string;
  tagline?: string;
  body?: string;
};

export type HomepageSection =
  | OpeningStatementSection
  | CampaignHeroSection
  | CampaignFilmSection
  | FullWidthImageSection
  | FullWidthVideoSection
  | SplitMediaTextSection
  | EditorialTextSection
  | ProductRowSection
  | ProductFeatureSection
  | CollectionIntroductionSection
  | CollectionManifestoSection
  | LookbookSequenceSection
  | QuoteSection
  | JournalArticlesSection
  | MaterialFeatureSection
  | NewsletterSection
  | ClosingStatementSection;
