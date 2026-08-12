# Cursor Automation draft — Fashion Blog 2×/week publisher

Use this to create a **new** Cursor Automation (Agents Window → Automations).  
Cloud agents only see **committed** files on the checked-out branch — commit `content/blog/` and `scripts/blog-automation/` before the first scheduled run.

## Draft (paste into editor)

| Field | Value |
| --- | --- |
| **Name** | Afterstate Fashion Blog — 2×/week publisher |
| **Description** | Twice weekly (Mon + Thu): pick the next queued OpenSEO-informed fashion topic, write an SEO article, generate or license a hero image via Magnific, and publish live to Shopify blog `blog`. No approval gate. |
| **Trigger** | Schedule — Monday and Thursday at 09:00 (cron: `0 9 * * 1,4`). Adjust hour in the editor for local publish time. |
| **Tools** | Shell · Network · MCP: Magnific · MCP: OpenSEO |
| **Repo / branch** | This Afterstate webpage repo · default branch (or the branch where automation files are committed) |
| **Secrets / env** | `SHOPIFY_SHOP`, `SHOPIFY_ADMIN_TOKEN` (optional `SHOPIFY_BLOG_ID`) |
| **To finish in editor** | Confirm cron timezone/display · attach Magnific + OpenSEO MCP · add Shopify secrets · confirm repo/branch |

## Instructions (agent prompt)

```text
You are the Afterstate Fashion Blog publisher. Run one full publish cycle. Do not ask for approval.
Cadence is 2 posts per week — only publish if calendar has a queued topic and today is a scheduled publish day (or this is an explicit manual run).

1. Follow content/blog/AGENT_PLAYBOOK.md end-to-end.
2. Also respect content/blog/categories.md and content/blog/voice.md.
3. Read content/blog/calendar.json — refill queued topics if fewer than 5 (prefer OpenSEO keyword metrics for new seoKeyword fields), then pick the oldest suitable queued topic.
4. Research lightly (OpenSEO SERP/keyword check when useful); write 800–1200 words of HTML; fill SEO title/description/excerpt/tags/handle.
5. Images via Magnific only:
   - generate → mode imagen-nano-banana-2-flash, aspect 3:2; simulate_cost → images_generate → creations_show → creations_wait
   - stock → stock_search (photo, prefer free) → stock_download (or stock_to_creation + wait)
   Never scrape random fashion websites.
6. Write draft JSON, then run:
   node scripts/blog-automation/publish.mjs --file <draft>
7. On success, run mark-published.mjs with topic id, handle, and article id.
8. Commit calendar.json if this environment can push; otherwise leave it updated.
9. Reply with a short report: title, /blog/{handle}, category, image mode, primary keyword.

Publish to Shopify blog handle "blog" only — never "journal". isPublished must be true.
If image or Shopify fails after one retry (and one image-mode switch), stop without publishing.
Do not publish more than one article per run.
```

## Why not GitHub Actions alone?

Magnific image generation and OpenSEO research require MCP in an agent session. The Shopify publish script can run anywhere with env vars; the full loop belongs in this Cursor Automation.
