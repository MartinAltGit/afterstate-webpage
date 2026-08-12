/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /** Production origin for canonical / hreflang / og:url (no trailing slash) */
    PUBLIC_SITE_URL?: string;
    /** Zapier / Make / Klaviyo webhook — required for newsletter + demand capture */
    NEWSLETTER_WEBHOOK_URL?: string;
  }
}
