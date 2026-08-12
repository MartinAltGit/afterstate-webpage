# Fashion Blog — voice & SEO brief

## Brand position

Afterstate’s blog looks **outward**: world fashion trends, culture, craft, and how people actually dress. Calm, precise, useful. Not hype, not affiliate spam, not manifesto essays (those live in Journal).

## Tone

- Clear, observational, slightly editorial
- Confident without shouting
- Prefer concrete detail (silhouette, fabric, city context) over buzzwords
- Avoid: “must-have”, “slay”, “iconic”, emoji, clickbait questions as H1s

## Length & structure

- **~800–1200 words** of body copy
- HTML only (Shopify `body` / `contentHtml`)
- Suggested skeleton:

```html
<p><!-- lead: 2–3 sentences, keyword-aware, no fluff --></p>
<h2><!-- section --></h2>
<p>...</p>
<h2><!-- section --></h2>
<p>...</p>
<h2><!-- practical takeaway --></h2>
<p>...</p>
```

- Use `<h2>` / `<h3>`, `<p>`, `<ul><li>`, occasional `<blockquote>` — no scripts, no inline styles, no marketing banners
- One clear takeaway near the end

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
