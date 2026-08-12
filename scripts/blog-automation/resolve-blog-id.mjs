#!/usr/bin/env node
/**
 * Resolve Shopify blog GID by handle (default: "blog").
 *
 * Usage:
 *   node scripts/blog-automation/resolve-blog-id.mjs
 *   node scripts/blog-automation/resolve-blog-id.mjs --handle blog
 *
 * Env: SHOPIFY_SHOP, SHOPIFY_ADMIN_TOKEN
 */

import {adminGraphql} from './lib/admin.mjs';

const QUERY = `#graphql
  query Blogs($first: Int!) {
    blogs(first: $first) {
      nodes {
        id
        handle
        title
      }
    }
  }
`;

function parseArgs(argv) {
  const args = {handle: 'blog'};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--handle' && argv[i + 1]) {
      args.handle = argv[++i];
    }
  }
  return args;
}

async function main() {
  const {handle} = parseArgs(process.argv.slice(2));
  const data = await adminGraphql(QUERY, {first: 50});
  const blogs = data?.blogs?.nodes ?? [];
  const match = blogs.find((b) => b.handle === handle);

  if (!match) {
    console.error(
      `No blog with handle "${handle}". Found: ${
        blogs.map((b) => b.handle).join(', ') || '(none)'
      }`,
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        id: match.id,
        handle: match.handle,
        title: match.title,
        envHint: `SHOPIFY_BLOG_ID=${match.id}`,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
