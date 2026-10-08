// n8n Code node: JavaScript, Run Once for All Items.

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Select pending quotes sent at least seven full days ago, without changing the list.
function findQuotesForFollowUp(quotes, now = new Date()) {
  const referenceTime = new Date(now).getTime();
  if (!Number.isFinite(referenceTime)) throw new TypeError('now must be a valid date');

  return quotes.filter((quote) => {
    if (quote.status !== 'pending') return false;
    // Use ISO strings with a timezone. Missing or invalid dates are ignored.
    const sentTime = typeof quote.sentAt === 'string' ? new Date(quote.sentAt).getTime() : NaN;
    return Number.isFinite(sentTime) && referenceTime - sentTime >= SEVEN_DAYS_MS;
  });
}

// Read the records returned by the previous Supabase node.
const quotes = $input.all().map(item => item.json);

// Use the current date and time when the workflow runs.
const results = findQuotesForFollowUp(quotes, new Date());

return results.map(quote => ({ json: quote }));
