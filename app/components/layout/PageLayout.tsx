import type {ReactNode} from 'react';
import {useLocation} from 'react-router';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import campaignLook from '~/assets/mockups/campaign-look-new.jpg';
import {Aside} from '~/components/Aside';
import {LanguageSelector} from '~/components/commerce/LanguageSelector';
import {NewsletterPopup} from '~/components/content/NewsletterPopup';
import {AnnouncementBar} from '~/components/layout/AnnouncementBar';
import {SiteDrawers} from '~/components/layout/CartDrawer';
import {SiteFooter} from '~/components/layout/SiteFooter';
import {SiteHeader} from '~/components/layout/SiteHeader';
import {StageShell} from '~/components/layout/StageShell';
import {SkipToContent} from '~/components/navigation/SkipToContent';
import {
  CampaignLook,
  shouldShowClosingCampaignLook,
} from '~/sections/CampaignLook';

export type PageLayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  footer?: Promise<FooterQuery | null>;
  header?: HeaderQuery;
  isLoggedIn?: Promise<boolean>;
  publicStoreDomain?: string;
  children?: ReactNode;
  announcement?: ReactNode;
  newsletter?: ReactNode;
  languageSelector?: ReactNode;
  /** @deprecated Header shows language, not market. Use languageSelector. */
  marketSelector?: ReactNode;
};

/**
 * Root page chrome — atmospheric canvas, floating nav, centered stage.
 */
export function PageLayout({
  cart,
  children = null,
  isLoggedIn,
  announcement,
  newsletter,
  languageSelector,
  marketSelector,
}: PageLayoutProps) {
  const {pathname} = useLocation();
  const showCampaignLook = shouldShowClosingCampaignLook(pathname);
  const selector = languageSelector ?? marketSelector ?? (
    <LanguageSelector variant="compact" />
  );

  return (
    <Aside.Provider>
      <SiteDrawers cart={cart} isLoggedIn={isLoggedIn} />
      <SkipToContent />
      <StageShell
        header={
          <SiteHeader
            cart={cart}
            isLoggedIn={isLoggedIn}
            languageSelector={selector}
          />
        }
      >
        <AnnouncementBar>{announcement}</AnnouncementBar>
        <main id="main-content">{children}</main>
        {showCampaignLook ? <CampaignLook imageSrc={campaignLook} /> : null}
        <SiteFooter newsletter={newsletter} />
      </StageShell>
      <NewsletterPopup />
    </Aside.Provider>
  );
}
