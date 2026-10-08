import { findQuotesForFollowUp } from './followUp.js';

// Fictional clients and email addresses.
const quotes = [
  { id: 'Q001', clientName: 'Anna Rossi', email: 'anna@example.com', sentAt: '2026-09-28T10:00:00Z', amount: 1200, status: 'pending' },
  { id: 'Q002', clientName: 'Marco Bianchi', email: 'marco@example.com', sentAt: '2026-10-01T10:00:00Z', amount: 850, status: 'pending' },
  { id: 'Q003', clientName: 'Laura Verdi', email: 'laura@example.com', sentAt: '2026-10-05T10:00:00Z', amount: 450, status: 'pending' },
  { id: 'Q004', clientName: 'Paolo Neri', email: 'paolo@example.com', sentAt: '2026-09-20T10:00:00Z', amount: 2000, status: 'accepted' },
  { id: 'Q005', clientName: 'Sara Costa', email: 'sara@example.com', sentAt: '2026-09-22T10:00:00Z', amount: 600, status: 'rejected' },
];

// Fixed date so the example always selects Q001 and Q002.
console.table(findQuotesForFollowUp(quotes, new Date('2026-10-08T10:00:00Z')));
