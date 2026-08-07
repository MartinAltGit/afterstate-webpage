# Afterstate e2e (Playwright)

Smoke and critical-path tests for the Hydrogen storefront (Mock.shop or a linked Shopify store).

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

Playwright starts `npm run dev` via `webServer` (Hydrogen default port **3000**), or reuses an already-running server outside CI.

```bash
npm run test:e2e        # headless
npm run test:e2e:ui     # Playwright UI
```

Optional: `PLAYWRIGHT_BASE_URL` or `PORT` to override `http://localhost:3000`.

## Notes

- Selectors favor accessible roles and brand/nav copy (`Afterstate`, `Shop`, `Cart`, market nav).
- Mock.shop catalog/options vary — some steps use soft asserts or `test.skip` when add-to-cart is disabled.
- Do not commit secrets (`.env`, storefront tokens). Tests hit the local app only.
