# Accessibility — Afterstate

Target: **WCAG 2.2 Level AA** for buyer-facing surfaces. Accessibility is part of QA, not a polish pass.

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`PERFORMANCE.md`](./PERFORMANCE.md)

---

## Principles

1. Semantic HTML first; ARIA only when native elements are insufficient
2. Keyboard parity with pointer for all commerce actions
3. Visible focus at all times for keyboard users
4. Do not rely on color alone for state (sold out, errors, selected variant)
5. Respect `prefers-reduced-motion`
6. Useful text alternatives for meaningful images; empty/decorative marked appropriately

---

## Landmarks and structure

- One `<header>`, main `<main id="main-content">` (or equivalent), `<footer>`
- Skip link: “Skip to content” as first focusable control (`SkipToContent`)
- Heading order: one `h1` per view; no skipped levels for layout convenience
- Lists for nav and product grids where structure is a list

---

## Keyboard and focus

| Area | Requirement |
| --- | --- |
| Header nav | Tab order matches visual order; Escape closes submenus/drawers |
| Cart drawer / mobile nav | Focus trap while open; restore focus to opener on close |
| Variant / size controls | Buttons or radiogroup pattern; selected state exposed to AT |
| Dialogs / asides | `role="dialog"` + labelled; inert background when modal |
| Focus style | High-contrast visible ring; never `outline: none` without replacement |

---

## Forms

- Visible `<label>` (or programmatic association) for every input
- Error messages linked via `aria-describedby` / `aria-invalid`
- Newsletter and contact: clear success and failure feedback
- Do not use placeholder as the only label
- Discount / cart line updates announced where practical

---

## Cart and live updates

- Cart count / line changes: polite live region when items added/removed
- Sold out / unavailable variant: disabled + text reason, not color-only
- Mini-cart / drawer: announce open state to AT when appropriate

---

## Media

- Product images: alt describes product (title + color/key trait as needed); avoid “image of”
- Decorative editorial frames: empty alt when truly decorative
- Video: captions if speech/narrative; no autoplay with sound
- Icons that convey meaning: accessible name (text or `aria-label`)

---

## Motion

- Honor `prefers-reduced-motion: reduce` — disable or replace nonessential motion
- Do not use flashing content above WCAG thresholds
- Motion must not block interaction or steal focus

---

## Color and contrast

Wireframe neutrals must still meet **AA contrast** for text and essential UI chrome:

- Body text vs background ≥ 4.5:1
- Large text ≥ 3:1
- UI components / focus indicators ≥ 3:1 against adjacent colors

When brand colors land, re-check tokens in `app/styles/tokens.css`.

---

## Markets and language

- `lang` on document reflects current locale (Hydrogen / root)
- MarketSelector operable by keyboard; current market announced
- Translated content uses Shopify translations when available; do not mark wrong `lang`

---

## Route-level expectations

| Route | Notes |
| --- | --- |
| Home / campaign | Sensible heading outline; hero not only in a background image without text alternative if text is painted in image |
| Collection | Filter controls labeled; empty state clear |
| PDP | Gallery keyboard operable; buy controls clear; sticky bar not trapping focus |
| Search | Results announced; no results state clear |
| Account | Forms and errors AA; do not break assistive tech with opaque SPAs |
| 404 | Explain state; link home/shop |

---

## Testing

### Automated (CI / PR)

- ESLint `jsx-a11y` (already in project)
- Optional axe on Playwright critical paths when e2e exists

### Manual (release)

- [ ] Keyboard-only: home → collection → PDP → add to cart → drawer → checkout link
- [ ] Screen reader smoke (VoiceOver or NVDA): nav, variant select, add to cart
- [ ] Zoom 200%: layout usable, no loss of buy path
- [ ] Reduced motion OS setting: no essential info only in motion
- [ ] Focus visible on all interactive controls

### Do not

- Assert a11y by screenshot alone
- Remove focus outlines for aesthetics
- Use `div` + click handlers for primary navigation links

---

## Ownership

| Area | Owner |
| --- | --- |
| Component patterns | Engineering |
| Alt text / editorial media | Content |
| Contrast tokens | Design + engineering at brand phase |
| Release sign-off | QA checklist in ROADMAP |
