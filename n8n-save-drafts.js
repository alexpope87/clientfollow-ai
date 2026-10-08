// n8n Code node: JavaScript, Run Once for All Items.
// Set this to the exact name of the Code node BEFORE Gemini.
const QUOTES_NODE_NAME = 'Code';
const drafts = [];
const seenQuoteIds = new Set();

function validId(value) {
  return (typeof value === 'string' && value.trim().length > 0)
    || (typeof value === 'number' && Number.isSafeInteger(value));
}

const items = $input.all();
for (let index = 0; index < items.length; index++) {
  const text = items[index].json?.content?.parts?.[0]?.text;
  if (typeof text !== 'string' || !text.trim()) {
    console.warn(`Skipped Gemini item ${index}: empty response.`);
    continue;
  }

  // Accept plain JSON or a single Markdown JSON code block.
  let jsonText = text.trim();
  const fenced = jsonText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i);
  if (fenced) jsonText = fenced[1].trim();

  let generated;
  try {
    generated = JSON.parse(jsonText);
  } catch {
    console.warn(`Skipped Gemini item ${index}: expected JSON.`);
    continue;
  }

  if (!generated || Array.isArray(generated)
      || !validId(generated.quote_id)
      || typeof generated.email_subject !== 'string'
      || typeof generated.email_body !== 'string'
      || !generated.email_subject.trim()
      || !generated.email_body.trim()
      || /[\r\n]/.test(generated.email_subject.trim())) {
    console.warn(`Skipped Gemini item ${index}: incomplete or invalid draft.`);
    continue;
  }

  // itemMatching follows n8n's item links; it does NOT zip items by position.
  let quote;
  try {
    quote = $(QUOTES_NODE_NAME).itemMatching(index).json;
  } catch {
    console.warn(`Skipped Gemini item ${index}: original quote link unavailable.`);
    continue;
  }

  if (!validId(quote?.id)
      || String(generated.quote_id) !== String(quote.id)
      || quote.status !== 'pending') {
    console.warn(`Skipped Gemini item ${index}: quote ID mismatch or non-pending quote.`);
    continue;
  }

  const quoteKey = String(quote.id);
  if (seenQuoteIds.has(quoteKey)) {
    console.warn(`Skipped Gemini item ${index}: duplicate quote in this execution.`);
    continue;
  }
  seenQuoteIds.add(quoteKey);

  drafts.push({
    json: {
      quote_id: quote.id,
      email_subject: generated.email_subject.trim(),
      email_body: generated.email_body.trim(),
      status: 'pending_approval',
    },
    pairedItem: { item: index },
  });
}

return drafts;
