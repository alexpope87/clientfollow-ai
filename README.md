# ClientFollow AI

An AI-assisted sales follow-up workflow for small businesses and freelancers. It identifies overdue quotes, generates email drafts, and stores them for human approval. Emails are not sent automatically.

## Workflow and tools

Manual Trigger → Supabase quotes → overdue-quote Code → Supabase followup_drafts → duplicate-filter Code → Gemini → draft-validation Code → Supabase Create Row.

- **Codex:** supports JavaScript development, verification, and documentation.
- **n8n Cloud:** orchestrates the workflow and connects services.
- **Gemini:** generates email subjects and bodies as JSON.
- **Supabase:** stores quotes and drafts awaiting approval.

Only `pending` quotes sent at least 168 hours ago qualify. Accepted/rejected quotes and future or invalid dates are excluded. Quotes with any existing draft are skipped, regardless of its status (`pending_approval`, `approved`, `rejected`, or `sent`). Generated drafts require a valid subject, body, and matching quote ID.

## Files and setup

- `followUp.js`: reusable selection function.
- `example.js` / `followUp.test.js`: standalone example and automated tests.
- `n8n-followup.js`: selects overdue quotes from incoming items.
- `n8n-filter-duplicates.js`: excludes quotes with any existing draft.
- `n8n-save-drafts.js`: validates Gemini output and prepares rows with `status: pending_approval`.

Paste each n8n script into a JavaScript Code node in **Run Once for All Items** mode. Configure node names to match your workflow: the duplicate filter references `Code in JavaScript`; draft validation must reference the duplicate-filter node immediately before Gemini. Its local default is `Code`, so either name the filter `Code` or update that constant in the n8n editor.

Read all relevant drafts with **Return All**, including `quote_id`, without filtering by status. On the drafts lookup, enable **Execute Once** and **Always Output Data**, and use **Stop Workflow** on errors. Leave Always Output Data disabled on the duplicate filter. Ask Gemini for JSON containing `quote_id`, `email_subject`, and `email_body`; preserve item links through Gemini for ID validation. Store credentials in n8n credential settings, never in source files.

## Validation

The latest successful n8n Cloud test read **6 quotes**: **3** qualified for follow-up and **3** existing drafts covered those quotes. The duplicate filter returned **0 new follow-ups**, so **Gemini was not executed**. This result was confirmed by the project owner.

Local checks cover the 168-hour boundary, excluded states, invalid/future dates, empty draft results, duplicate filtering, malformed Gemini responses, and ID matching. Run the standalone tests and example with Node.js 18+ (no package installation required):

```sh
npm test
npm start
```

The repository contains scripts rather than a complete workflow export. Cloud services require separately configured accounts. Duplicate filtering checks visible existing rows; concurrent executions can still create duplicates without a database uniqueness constraint or transactional safeguard.
