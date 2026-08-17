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
2. Also respect content/blog/categories.md, content/blog/voice.md, and content/blog/clusters.md.
3. Verify Shopify with: node scripts/blog-automation/resolve-blog-id.mjs
4. Sync the calendar: node scripts/blog-automation/sync-calendar.mjs
5. Read content/blog/calendar.json — refill queued topics if fewer than minQueuedBeforeRefill, then pick the oldest queued topic that is not already live on Shopify.
6. Research lightly (OpenSEO SERP/keyword check when useful). Write HTML from voice.md: pillar 1200–1800 words with takeaways/answers/FAQ, or spoke 800–1200 with a link back to the hub. At least 5 in-body <a href> links (live /blog posts, /shop, /afterstate-001-no-rush). Include cluster and role from the calendar in the draft JSON.
7. Images via Magnific only:
   - generate → mode imagen-nano-banana-2-flash, aspect 3:2; simulate_cost → images_generate → creations_show → creations_wait
   - stock → stock_search (photo, prefer free) → stock_download (or stock_to_creation + wait)
   Never scrape random fashion websites.
8. Write draft JSON, then run:
   node scripts/blog-automation/publish.mjs --file <draft>
   If alreadyExists is true, mark that topic published and publish the NEXT queued topic. Do not end the run after only recovering a duplicate. The run must create one new Shopify article unless no queued topics remain.
9. On success, run mark-published.mjs with topic id, handle, and article id.
10. Commit and push content/blog/calendar.json on this branch. If you cannot push to main, open a PR.
11. Reply with a short report: title, /blog/{handle}, category, image mode, primary keyword.

Publish to Shopify blog handle "blog" only — never "journal". isPublished must be true.
If image or Shopify fails after one retry (and one image-mode switch), stop without publishing.
Do not publish more than one new article per run.
```

## Why not GitHub Actions alone?

Magnific image generation and OpenSEO research require MCP in an agent session. The Shopify publish script can run anywhere with env vars; the full loop belongs in this Cursor Automation.
