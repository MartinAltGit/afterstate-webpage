#!/usr/bin/env node
/**
 * Publish a fashion-blog article to Shopify (blog handle "blog").
 * Auto-publishes (isPublished: true) — no approval gate.
 *
 * Usage:
 *   node scripts/blog-automation/publish.mjs --file content/blog/.last-draft.json
 *   node scripts/blog-automation/publish.mjs --stdin < draft.json
 *
 * Env: SHOPIFY_SHOP plus SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET
 *      (or legacy SHOPIFY_ADMIN_TOKEN)
 * Optional: SHOPIFY_BLOG_ID (skips lookup), SHOPIFY_API_VERSION
 *
 * Draft JSON:
 * {
 *   "title": "...",
 *   "handle": "...",
 *   "body": "<p>...</p>",
 *   "summary": "...",
 *   "seoTitle": "...",
 *   "seoDescription": "...",
 *   "tags": ["trends"],
 *   "cluster": "quiet-luxury",
 *   "role": "spoke",
 *   "imageUrl": "https://...",
 *   "imageAlt": "...",
 *   "authorName": "Afterstate",
 *   "isPublished": true
 * }
 */

import {readFileSync} from 'node:fs';
import {adminGraphql, describeShopifyAuth, slugifyHandle} from './lib/admin.mjs';

const BLOGS_QUERY = `#graphql
  query Blogs($first: Int!) {
    blogs(first: $first) {
      nodes {
        id
        handle
      }
    }
  }
`;

const CREATE_MUTATION = `#graphql
  mutation ArticleCreate($article: ArticleCreateInput!) {
    articleCreate(article: $article) {
      article {
        id
        handle
        title
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const ARTICLES_BY_HANDLE_QUERY = `#graphql
  query ArticlesByHandle($query: String!) {
    articles(first: 5, query: $query) {
      nodes {
        id
        handle
        title
      }
    }
  }
`;

function parseArgs(argv) {
  const args = {file: null, stdin: false};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) {
      args.file = argv[++i];
    } else if (argv[i] === '--stdin') {
      args.stdin = true;
    }
  }
  return args;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function resolveBlogId(handle = 'blog') {
  if (process.env.SHOPIFY_BLOG_ID) {
    return process.env.SHOPIFY_BLOG_ID;
  }
  const data = await adminGraphql(BLOGS_QUERY, {first: 50});
  const match = (data?.blogs?.nodes ?? []).find((b) => b.handle === handle);
  if (!match) {
    throw new Error(
      `Blog handle "${handle}" not found. Create it in Admin or set SHOPIFY_BLOG_ID.`,
    );
  }
  return match.id;
}

function validateDraft(draft) {
  const required = ['title', 'body', 'summary', 'imageUrl'];
  for (const key of required) {
    if (!draft[key] || !String(draft[key]).trim()) {
      throw new Error(`Draft missing required field: ${key}`);
    }
  }
}

function mergeSystemTags(draft) {
  const tags = Array.isArray(draft.tags)
    ? draft.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : [];
  const cluster = String(draft.cluster || '')
    .trim()
    .toLowerCase();
  const role = String(draft.role || '')
    .trim()
    .toLowerCase();

  if (cluster) {
    const tag = `cluster-${cluster}`;
    if (!tags.includes(tag)) tags.push(tag);
  }
  if (role === 'pillar' || role === 'spoke') {
    const tag = `role-${role}`;
    if (!tags.includes(tag)) tags.push(tag);
  }
  return tags;
}

function warnHubShape(draft) {
  const role = String(draft.role || '')
    .trim()
    .toLowerCase();
  if (role !== 'pillar' && role !== 'spoke') return;

  const body = String(draft.body);
  const missing = [];
  if (!body.includes('blog-answer')) missing.push('blog-answer');
  if (role === 'pillar' && !body.includes('blog-takeaways')) {
    missing.push('blog-takeaways');
  }
  if (!body.includes('blog-faq')) missing.push('blog-faq');
  if (missing.length) {
    console.error(
      `[blog:publish] ${role} HTML missing: ${missing.join(', ')} (see content/blog/voice.md)`,
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file && !args.stdin) {
    console.error(
      'Usage: node scripts/blog-automation/publish.mjs --file draft.json | --stdin',
    );
    process.exit(1);
  }

  const raw = args.stdin
    ? await readStdin()
    : readFileSync(args.file, 'utf8');
  const draft = JSON.parse(raw);
  validateDraft(draft);
  warnHubShape(draft);

  const auth = describeShopifyAuth();
  if (auth === 'missing') {
    throw new Error(
      'Missing Shopify auth. Set SHOPIFY_SHOP plus SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (or a shpat_ SHOPIFY_ADMIN_TOKEN).',
    );
  }
  console.error(`[blog:publish] auth=${auth}`);

  const blogId = await resolveBlogId('blog');
  const handle = draft.handle?.trim() || slugifyHandle(draft.title);
  const authorName = draft.authorName?.trim() || 'Afterstate';
  const isPublished = draft.isPublished !== false;

  const existingData = await adminGraphql(ARTICLES_BY_HANDLE_QUERY, {
    query: `handle:${handle}`,
  });
  const existing = (existingData?.articles?.nodes ?? []).find(
    (node) => node.handle === handle,
  );
  if (existing) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          alreadyExists: true,
          id: existing.id,
          handle: existing.handle,
          title: existing.title,
          path: `/blog/${existing.handle}`,
        },
        null,
        2,
      ),
    );
    return;
  }

  const metafields = [];
  if (draft.seoTitle?.trim()) {
    metafields.push({
      namespace: 'global',
      key: 'title_tag',
      type: 'single_line_text_field',
      value: draft.seoTitle.trim(),
    });
  }
  if (draft.seoDescription?.trim()) {
    metafields.push({
      namespace: 'global',
      key: 'description_tag',
      type: 'single_line_text_field',
      value: draft.seoDescription.trim(),
    });
  }

  const article = {
    blogId,
    title: draft.title.trim(),
    handle,
    body: draft.body,
    summary: draft.summary,
    author: {name: authorName},
    isPublished,
    tags: mergeSystemTags(draft),
    image: {
      url: draft.imageUrl,
      altText: draft.imageAlt?.trim() || draft.title.trim(),
    },
  };

  if (metafields.length) {
    article.metafields = metafields;
  }

  if (draft.publishDate) {
    article.publishDate = draft.publishDate;
  }

  const data = await adminGraphql(CREATE_MUTATION, {article});
  const payload = data?.articleCreate;
  const errors = payload?.userErrors ?? [];

  if (errors.length) {
    console.error(JSON.stringify({ok: false, userErrors: errors}, null, 2));
    process.exit(1);
  }

  const created = payload?.article;
  console.log(
    JSON.stringify(
      {
        ok: true,
        id: created?.id,
        handle: created?.handle,
        title: created?.title,
        path: created?.handle ? `/blog/${created.handle}` : null,
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
