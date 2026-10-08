const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Select pending quotes sent at least seven full days ago, without changing the list.
export function findQuotesForFollowUp(quotes, now = new Date()) {
  const referenceTime = new Date(now).getTime();
  if (!Number.isFinite(referenceTime)) throw new TypeError('now must be a valid date');

  return quotes.filter((quote) => {
    if (quote.status !== 'pending') return false;
    // Use ISO strings with a timezone. Missing or invalid dates are ignored.
    const sentTime = typeof quote.sentAt === 'string' ? new Date(quote.sentAt).getTime() : NaN;
    return Number.isFinite(sentTime) && referenceTime - sentTime >= SEVEN_DAYS_MS;
  });
}
