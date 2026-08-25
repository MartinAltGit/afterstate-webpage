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
    /** Klaviyo private API key (`pk_…`). Server-only — never prefix with PUBLIC_. */
    KLAVIYO_PRIVATE_API_KEY?: string;
    /** Klaviyo list ID for newsletter signups (Audience → Lists). */
    KLAVIYO_NEWSLETTER_LIST_ID?: string;
    /** Optional Klaviyo list for sold-out “Make a demand”. Falls back to newsletter list. */
    KLAVIYO_DEMAND_LIST_ID?: string;
    /** Optional Zapier / Make webhook if Klaviyo is not configured */
    NEWSLETTER_WEBHOOK_URL?: string;
    /**
     * Temporary storefront password. When set, the Hydrogen storefront
     * requires this password. Unset to open the store. Never prefix with PUBLIC_.
     */
    STOREFRONT_PASSWORD?: string;
  }
}
