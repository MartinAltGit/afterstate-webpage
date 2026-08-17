# Fashion Blog — voice & SEO brief

## Brand position

Afterstate’s blog looks **outward**: world fashion trends, culture, craft, and how people actually dress. Calm, precise, useful. Not hype, not affiliate spam, not manifesto essays (those live in Journal).

## Tone

- Clear, observational, slightly editorial
- Confident without shouting
- Prefer concrete detail (silhouette, fabric, city context) over buzzwords
- Avoid: “must-have”, “slay”, “iconic”, emoji, clickbait questions as H1s

## Length & structure

Every post is **pillar**, **spoke**, or (rarely) **standard**. Read `role` + `cluster` from [`calendar.json`](./calendar.json) and the map in [`clusters.md`](./clusters.md). HTML only (Shopify `body` / `contentHtml`). One H1 only (the Shopify title) — body starts at H2.

Allowed body classes: `blog-answer`, `blog-takeaways`, `blog-deeper`, `blog-faq`, `blog-sources`, `blog-kicker`. No scripts, no inline styles, no marketing banners. The look-ad rail is the shop CTA.

### Pillar — hub guide (~1200–1800 words)

Short answers on this page; each H2 is one search intent and links to a spoke when that spoke exists. Do **not** put a table of contents in the HTML — the storefront builds “On this page” from H2s.

```html
<div class="blog-answer">
  <p><strong>In short.</strong> Two or three sentences: definition, one caveat, what to do next.</p>
</div>
<div class="blog-takeaways">
  <p class="blog-kicker">Key takeaways</p>
  <ul>
    <li>Four concrete points. No slogans.</li>
  </ul>
</div>
<p><!-- Hub intro: this page is the map; each section below has a short answer and a deeper guide. --></p>
<h2><!-- Intent as a clear heading, not clickbait --></h2>
<div class="blog-answer">
  <p>Forty to sixty words that could stand alone as a snippet.</p>
</div>
<p><!-- One or two short paragraphs. --></p>
<div class="blog-deeper">
  <p class="blog-kicker">Go deeper</p>
  <p><a href="/blog/spoke-handle">Spoke title</a> — one line on why to open it.</p>
</div>
<!-- Repeat H2 + answer + optional deeper for 5–8 intents -->
<div class="blog-faq">
  <h2>Frequently asked questions</h2>
  <h3><!-- Question people actually search --></h3>
  <p><!-- Direct answer, 2–4 sentences. --></p>
</div>
```

Include `blog-sources` only when you cite real craft/industry sources (no fake studies).

### Spoke — one question (~800–1200 words)

```html
<div class="blog-answer">
  <p><strong>In short.</strong> The answer to this spoke’s keyword.</p>
</div>
<p><!-- Lead. Link once to the pillar: see the complete guide at /blog/{hubHandle}. --></p>
<h2><!-- Section --></h2>
<p>...</p>
<h2><!-- Section --></h2>
<p>...</p>
<div class="blog-deeper">
  <p class="blog-kicker">In this series</p>
  <p><a href="/blog/{hubHandle}">Pillar title</a> — the rest of the map.</p>
</div>
<div class="blog-faq">
  <h2>Frequently asked questions</h2>
  <h3><!-- 2–4 questions unique to this spoke --></h3>
  <p>...</p>
</div>
```

### Standard — one-off (~800–1200 words)

Use only when the topic has no cluster.

```html
<p><!-- lead: 2–3 sentences, keyword-aware, no fluff --></p>
<h2><!-- section --></h2>
<p>...</p>
<h2><!-- section --></h2>
<p>...</p>
<h2><!-- practical takeaway --></h2>
<p>...</p>
```

Use `<h2>` / `<h3>`, `<p>`, `<ul><li>`, occasional `<blockquote>`, and the hub `div`s above.

## Mandatory fields (every publish)

| Field | Rule |
| --- | --- |
| `title` | Human title; include primary keyword naturally if it fits |
| `handle` | kebab-case, unique, stable |
| `summary` / excerpt | 140–160 characters, keyword-aware |
| `seoTitle` | ≤ ~60 characters |
| `seoDescription` | ≤ ~155 characters |
| `tags` | 3–6 tags from calendar + category |
| `image` | Required — Magnific generate or stock |
| `author` | `Afterstate` unless calendar overrides |

## SEO checklist

1. Primary keyword in title **or** first paragraph (not stuffed)
2. Unique meta title + description
3. One H1 only (Shopify title) — body starts at H2
4. Descriptive image `altText`
5. No duplicate handles; check calendar for prior `published` handles
6. Prefer evergreen URLs (`quiet-luxury-street-style` not `march-11-recap`)

## Image prompts (generate)

Editorial fashion photography, quiet atmosphere, soft natural light or foggy city dusk, real clothing silhouettes, no brand logos, no unreadable text overlays, no watermarks, Mediterranean stone / cool fog palette when it fits Afterstate.
