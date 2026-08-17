export const CLUSTER_TAG_PREFIX = 'cluster-';
export const ROLE_TAG_PREFIX = 'role-';

export type BlogRole = 'pillar' | 'spoke';

export type BlogClusterId =
  | 'quiet-luxury'
  | 'capsule-wardrobe'
  | 'fabric'
  | 'slow-fashion'
  | 'silhouette'
  | 'street';

export const BLOG_CLUSTERS: Record<
  BlogClusterId,
  {label: string; hubHandle: string | null}
> = {
  'quiet-luxury': {
    label: 'Quiet luxury',
    hubHandle: 'what-is-quiet-luxury',
  },
  'capsule-wardrobe': {
    label: 'Capsule wardrobe',
    hubHandle: 'mens-capsule-wardrobe',
  },
  fabric: {
    label: 'Fabric & cloth',
    hubHandle: 'what-is-gsm-fabric',
  },
  'slow-fashion': {
    label: 'Slow fashion',
    hubHandle: 'slow-fashion-buying-habit',
  },
  silhouette: {
    label: 'Silhouette',
    hubHandle: 'relaxed-fit-trousers',
  },
  street: {
    label: 'Street style',
    hubHandle: 'minimal-streetwear',
  },
};

const CLUSTER_IDS = new Set(Object.keys(BLOG_CLUSTERS));

export function isSystemBlogTag(tag: string) {
  const value = tag.trim().toLowerCase();
  return (
    value.startsWith(CLUSTER_TAG_PREFIX) || value.startsWith(ROLE_TAG_PREFIX)
  );
}

export function visibleBlogTags(tags: string[] | null | undefined) {
  return (tags ?? []).filter((tag) => tag.trim() && !isSystemBlogTag(tag));
}

export function clusterFromTags(
  tags: string[] | null | undefined,
): BlogClusterId | null {
  for (const tag of tags ?? []) {
    const value = tag.trim().toLowerCase();
    if (!value.startsWith(CLUSTER_TAG_PREFIX)) continue;
    const id = value.slice(CLUSTER_TAG_PREFIX.length);
    if (CLUSTER_IDS.has(id)) return id as BlogClusterId;
  }
  return null;
}

export function clusterLabel(id: BlogClusterId | null) {
  if (!id) return null;
  return BLOG_CLUSTERS[id].label;
}

export function clusterTag(id: string) {
  return `${CLUSTER_TAG_PREFIX}${id.trim().toLowerCase()}`;
}

export function roleTag(role: BlogRole) {
  return `${ROLE_TAG_PREFIX}${role}`;
}
