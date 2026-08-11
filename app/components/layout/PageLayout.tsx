import type {ReactNode} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {MarketSelector} from '~/components/commerce/MarketSelector';
import {AnnouncementBar} from '~/components/layout/AnnouncementBar';
import {SiteDrawers} from '~/components/layout/CartDrawer';
import {SiteFooter} from '~/components/layout/SiteFooter';
import {SiteHeader} from '~/components/layout/SiteHeader';
import {StageShell} from '~/components/layout/StageShell';
import {SkipToContent} from '~/components/navigation/SkipToContent';

export type PageLayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  footer?: Promise<FooterQuery | null>;
  header?: HeaderQuery;
  isLoggedIn?: Promise<boolean>;
  publicStoreDomain?: string;
  children?: ReactNode;
  announcement?: ReactNode;
  newsletter?: ReactNode;
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
  marketSelector,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <SiteDrawers
        cart={cart}
        isLoggedIn={isLoggedIn}
        marketSelector={marketSelector ?? <MarketSelector variant="panel" />}
      />
      <SkipToContent />
      <StageShell
        header={
          <SiteHeader
            cart={cart}
            isLoggedIn={isLoggedIn}
            marketSelector={marketSelector ?? <MarketSelector />}
          />
        }
      >
        <AnnouncementBar>{announcement}</AnnouncementBar>
        <main id="main-content">{children}</main>
        <SiteFooter newsletter={newsletter} />
      </StageShell>
    </Aside.Provider>
  );
}
