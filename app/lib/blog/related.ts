import {clusterFromTags} from './clusters';

type RelatedArticle = {
  handle: string;
  tags?: string[] | null;
};

export function pickRelatedArticles<T extends RelatedArticle>(
  currentHandle: string,
  currentTags: string[] | null | undefined,
  articles: T[],
  limit = 3,
): {items: T[]; fromCluster: boolean} {
  const cluster = clusterFromTags(currentTags);
  const others = articles.filter((article) => article.handle !== currentHandle);

  const siblings = cluster
    ? others.filter((article) => clusterFromTags(article.tags) === cluster)
    : [];
  const rest = others.filter(
    (article) => !siblings.some((sibling) => sibling.handle === article.handle),
  );

  return {
    items: [...siblings, ...rest].slice(0, limit),
    fromCluster: siblings.length > 0,
  };
}
