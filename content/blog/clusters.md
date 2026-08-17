# Fashion Blog — topic clusters

Hub-and-spoke map for the Fashion Blog (`/blog`). One **pillar** ranks for the head term; **spokes** rank for long-tail queries and link back to the hub. The storefront template stays the same — structure lives in article HTML (`voice.md`).

## How it works

```
Pillar (complete guide)
  ├── spoke (one intent, one keyword)
  ├── spoke
  └── spoke
```

- **Pillar:** short answers on the page, then a “Go deeper” link to each spoke. Takeaways, FAQ, optional sources.
- **Spoke:** full answer for one question. First or last section links back to the pillar.
- **Standard:** rare one-off. Use only when a topic has no cluster.

Shopify tags (hidden on the article page): `cluster-{id}` and `role-pillar` / `role-spoke`.  
`publish.mjs` adds these from the draft’s `cluster` + `role` fields.

## Clusters

| Id | Pillar keyword | Hub handle | Spokes to fill |
| --- | --- | --- | --- |
| `quiet-luxury` | quiet luxury | `what-is-quiet-luxury` (live) | how to dress it (`how-to-dress-quiet-luxury`); quiet luxury fashion; vs logos |
| `capsule-wardrobe` | capsule wardrobe men / how to build a capsule wardrobe | `mens-capsule-wardrobe` | seasonal refresh; travel capsule |
| `fabric` | what is gsm fabric | `what-is-gsm-fabric` | organic cotton (`organic-cotton-clothing-quality`); denim fit |
| `slow-fashion` | slow fashion | `slow-fashion-buying-habit` | buying habit; repair; not a brand listicle |
| `silhouette` | relaxed fit trousers | `relaxed-fit-trousers` | oversized blazer (`oversized-blazer-outfits`); proportion |
| `street` | minimal streetwear | — (spoke-first: `minimal-streetwear`) | city uniforms by place |

Hub handle may be empty until that pillar is published. Spokes can ship first; they still carry the cluster tag.

## Refill rules

1. Prefer a **spoke** that completes an open cluster (hub live or queued, fewer than 3 spokes) before starting a new cluster.
2. Do not invent a second pillar in a cluster that already has one.
3. Assign `role` + `cluster` (+ `hubHandle` on spokes) on every calendar topic.
4. Primary keyword still comes from [`KEYWORD_MAP.md`](./KEYWORD_MAP.md).
5. Product links stay rare — the look-ad rail is the shop CTA. Body links are editorial (hub ↔ spoke, maybe one collection).

## Storefront behaviour

Same article template for every post. When the HTML includes hub blocks, CSS styles them. When there are four or more H2s, the page shows **On this page**. Related cards prefer cluster siblings over “latest”.
