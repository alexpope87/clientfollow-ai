// n8n Code node: JavaScript, Run Once for All Items.
// This must exactly match the first Code node's name in your workflow.
const QUOTES_NODE_NAME = 'Code in JavaScript';

function idKey(value) {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value);
  throw new Error('Missing or invalid quote ID. Check the node output.');
}

let quoteItems;
try {
  quoteItems = $(QUOTES_NODE_NAME).all();
} catch {
  throw new Error(`Cannot read node "${QUOTES_NODE_NAME}". Check its exact name and execute it first.`);
}

// The immediately preceding node must read followup_drafts successfully.
// Enable Always Output Data on that Supabase node for zero rows.
const draftItems = $input.all();
const blockedIds = new Set();

for (const item of draftItems) {
  const draft = item.json;
  if (!draft || typeof draft !== 'object' || Array.isArray(draft)) {
    throw new Error('Invalid followup_drafts output. Stop and check the Supabase node.');
  }
  // An empty object is the placeholder produced by Always Output Data.
  if (Object.keys(draft).length === 0) continue;
  if (typeof draft.status !== 'string' || !draft.status.trim()) {
    throw new Error('Draft status is missing. Read quote_id and status from Supabase.');
  }
  const key = idKey(draft.quote_id);
  if (draft.status === 'pending_approval') blockedIds.add(key);
}

const results = [];
const seenIds = new Set();
for (const item of quoteItems) {
  const quote = item.json;
  const key = idKey(quote?.id);
  if (blockedIds.has(key) || seenIds.has(key)) continue;
  seenIds.add(key);
  results.push({ json: quote });
}

// These are quote records, not the draft items from our immediate input.
// After Gemini, use itemMatching against THIS filter node, not the first Code.
return results;
