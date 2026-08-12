#!/usr/bin/env node
/**
 * Mark a calendar topic as published after a successful Shopify publish.
 *
 * Usage:
 *   node scripts/blog-automation/mark-published.mjs \
 *     --id 2026-w33-quiet-luxury-street \
 *     --handle quiet-luxury-meets-street \
 *     --article-id gid://shopify/Article/123
 */

import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CALENDAR_PATH = join(ROOT, 'content/blog/calendar.json');

function parseArgs(argv) {
  const args = {id: null, handle: null, articleId: null};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--id' && argv[i + 1]) args.id = argv[++i];
    else if (argv[i] === '--handle' && argv[i + 1]) args.handle = argv[++i];
    else if (argv[i] === '--article-id' && argv[i + 1])
      args.articleId = argv[++i];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.id || !args.handle) {
    console.error(
      'Usage: mark-published.mjs --id <topicId> --handle <handle> [--article-id gid]',
    );
    process.exit(1);
  }

  const calendar = JSON.parse(readFileSync(CALENDAR_PATH, 'utf8'));
  const topic = calendar.topics.find((t) => t.id === args.id);
  if (!topic) {
    console.error(`Topic not found: ${args.id}`);
    process.exit(1);
  }

  topic.status = 'published';
  topic.handle = args.handle;
  topic.publishedAt = new Date().toISOString();
  if (args.articleId) {
    topic.notes = args.articleId;
  }

  writeFileSync(CALENDAR_PATH, `${JSON.stringify(calendar, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        ok: true,
        id: topic.id,
        handle: topic.handle,
        publishedAt: topic.publishedAt,
      },
      null,
      2,
    ),
  );
}

main();
