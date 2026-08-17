# Fashion Blog — category rotation

Publish to Shopify blog handle **`blog`** only. Never use the `journal` blog for these posts.

## Categories (rotate across the calendar)

| Key | Use for | Typical image mode |
| --- | --- | --- |
| `trends` | Silhouettes, color stories, “what’s moving” | `generate` |
| `seasonal` | Weather, layering, transitional dressing | `generate` |
| `street_style` | City uniforms, observed real-world looks | `stock` |
| `craft` | Fabric, construction, fit, materials literacy | `generate` |
| `culture` | Industry/culture news framed for readers, not gossip | `stock` |

## Rotation rules

1. Do not publish the same `category` twice in a row when other queued categories exist.
2. Aim for roughly **2 posts/week**: mix trends, craft, culture, street, seasonal across the month.
3. Prefer evergreen angles over day-of gossip. If covering “news”, explain *why it matters for how people dress*.
4. Keep Afterstate brand philosophy, manifesto, and product origin stories on **`/journal`**.
5. Pick `seoKeyword` from [`KEYWORD_MAP.md`](./KEYWORD_MAP.md) / OpenSEO — do not invent high-volume targets blindly.
6. Prefer filling **spokes** under an open cluster before starting a new pillar. See [`clusters.md`](./clusters.md).

## Internal linking

Every post belongs to a **cluster** ([`clusters.md`](./clusters.md)). Link like this:

- **Pillar → spokes:** one `blog-deeper` block per live (or about-to-publish) spoke. Do not invent URLs for posts that are not in the calendar.
- **Spoke → pillar:** one link to `/blog/{hubHandle}` in the lead or a closing `blog-deeper`.
- Product: `/collections/all` or a specific collection only when the article genuinely connects (fit, fabric, silhouette). The look-ad rail is the shop CTA.

Do not turn every post into a product pitch.
