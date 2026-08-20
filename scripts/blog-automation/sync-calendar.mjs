#!/usr/bin/env node
/**
 * Mark queued calendar topics as published when Shopify already has that handle.
 * Stops a stale calendar from making the next run retry a live article.
 *
 * Usage:
 *   node scripts/blog-automation/sync-calendar.mjs
 *
 * Env: SHOPIFY_SHOP plus SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET
 *      (or legacy SHOPIFY_ADMIN_TOKEN)
 */

import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {adminGraphql, slugifyHandle} from './lib/admin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CALENDAR_PATH = join(ROOT, 'content/blog/calendar.json');
const BLOG_HANDLE = 'blog';

const BLOG_ARTICLES_QUERY = `#graphql
  query BlogArticles($first: Int!) {
    blogs(first: 20) {
      nodes {
        handle
        articles(first: $first) {
          nodes {
            id
            handle
            title
          }
        }
      }
    }
  }
`;

function topicHandles(topic) {
  // Match only this topic's own handle (and title slug). Never match hubHandle —
  // spokes share a hub with a live pillar and would be wrongly marked published.
  const handles = [];
  if (topic.handle) handles.push(String(topic.handle).trim().toLowerCase());
  if (topic.title) handles.push(slugifyHandle(topic.title));
  return [...new Set(handles.filter(Boolean))];
}

async function loadLiveArticles() {
  const data = await adminGraphql(BLOG_ARTICLES_QUERY, {first: 100});
  const blogs = data?.blogs?.nodes ?? [];
  const blog = blogs.find((node) => node.handle === BLOG_HANDLE) ?? blogs[0];
  const nodes = blog?.articles?.nodes ?? [];
  const byHandle = new Map();
  for (const article of nodes) {
    if (article?.handle) byHandle.set(article.handle.toLowerCase(), article);
  }
  return byHandle;
}

function main() {
  return (async () => {
    const calendar = JSON.parse(readFileSync(CALENDAR_PATH, 'utf8'));
    const live = await loadLiveArticles();
    const synced = [];

    for (const topic of calendar.topics ?? []) {
      if (topic.status === 'published') continue;
      const match = topicHandles(topic)
        .map((handle) => live.get(handle))
        .find(Boolean);
      if (!match) continue;

      topic.status = 'published';
      topic.handle = match.handle;
      topic.publishedAt = topic.publishedAt || new Date().toISOString();
      topic.notes = match.id;
      synced.push({
        id: topic.id,
        handle: match.handle,
        articleId: match.id,
      });
    }

    if (synced.length) {
      writeFileSync(CALENDAR_PATH, `${JSON.stringify(calendar, null, 2)}\n`);
    }

    const queued = (calendar.topics ?? []).filter((t) => t.status === 'queued');
    console.log(
      JSON.stringify(
        {
          ok: true,
          liveCount: live.size,
          synced,
          nextQueuedId: queued[0]?.id ?? null,
          nextQueuedTitle: queued[0]?.title ?? null,
          queuedRemaining: queued.length,
        },
        null,
        2,
      ),
    );
  })();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
