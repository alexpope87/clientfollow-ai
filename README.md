# ClientFollow AI

The first component selects pending quotes sent at least seven full days (168 hours) ago. Accepted and rejected quotes are excluded. It returns complete matching objects without changing the original list.

Each quote has `id`, `clientName`, `email`, `sentAt`, `amount`, and `status`. Use ISO dates with a timezone, such as `2026-10-01T10:00:00Z`. Invalid or missing sending dates are ignored.

## Run

Use Node.js 18 or newer. No package installation or paid services are needed.

```sh
npm start
npm test
```

`example.js` contains five fictional quotes. Its fixed reference date is October 8, 2026 at 10:00 UTC, so Q001 and Q002 qualify.

## Use

```js
import { findQuotesForFollowUp } from './followUp.js';

const followUps = findQuotesForFollowUp(quotes); // Current time by default.
const result = findQuotesForFollowUp(quotes, new Date('2026-10-08T10:00:00Z'));
```

Tests cover the seven-day boundary, recent and future dates, accepted/rejected quotes, invalid dates, empty lists, time zones, and preservation of the original data.

This component only selects quotes. It does not send emails and contains no dashboard, database, AI service, or external integration.
