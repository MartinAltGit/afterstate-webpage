/**
 * Side-effect imports that pin high-churn shared CSS onto the root route
 * match. React Router only keeps stylesheet <link> tags for active matches;
 * without this, shared module CSS is unloaded on navigation and Back can
 * paint an unstyled frame (or stay broken until hard reload).
 *
 * Import this from root.tsx only — do not import from leaf routes.
 */
import '~/components/layout/StageShell.module.css';
import '~/components/layout/SiteHeader.module.css';
import '~/components/layout/SiteFooter.module.css';
import '~/components/layout/AnnouncementBar.module.css';
import '~/components/layout/MainNavigation.module.css';
import '~/components/layout/MobileNavigation.module.css';
import '~/components/layout/PageHero.module.css';
import '~/components/layout/PageContainer.module.css';
import '~/components/layout/EditorialStage.module.css';
import '~/components/layout/WelcomeOffer.module.css';
import '~/components/layout/ContentSection.module.css';
import '~/components/content/QuietPage.module.css';
import '~/components/content/NewsletterForm.module.css';
import '~/components/motion/Reveal.module.css';
import '~/components/feedback/Feedback.module.css';
import '~/components/feedback/NotFoundState.module.css';
import '~/components/commerce/ProductCard.module.css';
import '~/components/commerce/CartSummary.module.css';
import '~/components/commerce/CartLine.module.css';
import '~/components/commerce/LanguageSelector.module.css';
import '~/components/brand/BrandLogo.module.css';
