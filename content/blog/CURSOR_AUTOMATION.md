# Cursor Automation draft — Fashion Blog 2×/week publisher

Use this to create a **new** Cursor Automation (Agents Window → Automations), or to **replace** the Agent Instructions on the existing one.  
Cloud agents only see **committed** files on the checked-out branch — commit `content/blog/` and `scripts/blog-automation/` before the next scheduled run.

## Draft (paste into editor)

| Field | Value |
| --- | --- |
| **Name** | Afterstate Fashion Blog — 2×/week publisher |
| **Description** | Twice weekly (Mon + Thu): pick the next queued OpenSEO-informed fashion topic, write an SEO article, generate or license a hero image via Magnific, and publish live to Shopify blog `blog`. No approval gate. |
| **Trigger** | Schedule — Monday and Thursday at 09:00 (cron: `0 9 * * 1,4`). Adjust hour in the editor for local publish time. |
| **Tools** | Shell · Network · MCP: Magnific · MCP: OpenSEO |
| **Repo / branch** | This Afterstate webpage repo · `main` |
| **Secrets / env** | `SHOPIFY_SHOP`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` (optional `SHOPIFY_BLOG_ID`). Do **not** require `SHOPIFY_ADMIN_TOKEN`. |
| **To finish in editor** | Confirm cron timezone/display · attach Magnific + OpenSEO MCP · confirm the three Shopify secrets · confirm repo/branch |

## Instructions (agent prompt)

```text
You are the Afterstate Fashion Blog publisher. Run one full publish cycle. Do not ask for approval.
Cadence is 2 posts per week. Publish one queued topic on a scheduled day, or on an explicit manual Run after a missed/rate-limited slot.

Shopify auth is SHOPIFY_SHOP + SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET. Do not require SHOPIFY_ADMIN_TOKEN. If that token is missing, continue.

1. Follow content/blog/AGENT_PLAYBOOK.md end-to-end.
2. Also respect content/blog/categories.md and content/blog/voice.md.
3. Verify Shopify with: node scripts/blog-automation/resolve-blog-id.mjs
4. Read content/blog/calendar.json — refill queued topics if fewer than minQueuedBeforeRefill, then pick the oldest suitable queued topic.
5. Research lightly (OpenSEO SERP/keyword check when useful); write 800–1200 words of HTML; fill SEO title/description/excerpt/tags/handle.
6. Images via Magnific only:
   - generate → mode imagen-nano-banana-2-flash, aspect 3:2; simulate_cost → images_generate → creations_show → creations_wait
   - stock → stock_search (photo, prefer free) → stock_download (or stock_to_creation + wait)
   Never scrape random fashion websites.
7. Write draft JSON, then run:
   node scripts/blog-automation/publish.mjs --file <draft>
   If the script returns alreadyExists: true, treat as success.
8. On success, run mark-published.mjs with topic id, handle, and article id.
9. Commit and push content/blog/calendar.json on this branch so the next run does not repeat the topic.
10. Reply with a short report: title, /blog/{handle}, category, image mode, primary keyword.

Publish to Shopify blog handle "blog" only — never "journal". isPublished must be true.
If image or Shopify fails after one retry (and one image-mode switch), stop without publishing.
Do not publish more than one article per run.
```

## Why not GitHub Actions alone?

Magnific image generation and OpenSEO research require MCP in an agent session. The Shopify publish script can run anywhere with env vars; the full loop belongs in this Cursor Automation.
