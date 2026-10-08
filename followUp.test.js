import test from 'node:test';
import assert from 'node:assert/strict';
import { findQuotesForFollowUp } from './followUp.js';

const now = new Date('2026-10-08T10:00:00Z');
const quote = (sentAt, status = 'pending') => ({
  id: 'Q001', clientName: 'Test Client', email: 'client@example.com', sentAt, amount: 100, status,
});

test('includes pending quotes older than seven days', () => {
  const item = quote('2026-09-28T10:00:00Z');
  assert.deepEqual(findQuotesForFollowUp([item], now), [item]);
});
test('includes quotes exactly seven days old', () => {
  const item = quote('2026-10-01T10:00:00Z');
  assert.deepEqual(findQuotesForFollowUp([item], now), [item]);
});
test('excludes quotes one millisecond short of seven days', () => {
  assert.deepEqual(findQuotesForFollowUp([quote('2026-10-01T10:00:00.001Z')], now), []);
});
test('excludes recent pending quotes', () => {
  assert.deepEqual(findQuotesForFollowUp([quote('2026-10-05T10:00:00Z')], now), []);
});
test('excludes accepted and rejected quotes even when old', () => {
  const items = ['accepted', 'rejected'].map(status => quote('2026-09-01T10:00:00Z', status));
  assert.deepEqual(findQuotesForFollowUp(items, now), []);
});
test('excludes future, invalid and missing dates', () => {
  const items = ['2026-10-09T10:00:00Z', 'invalid', undefined, null, ''].map(date => quote(date));
  assert.deepEqual(findQuotesForFollowUp(items, now), []);
});
test('handles an empty list', () => {
  assert.deepEqual(findQuotesForFollowUp([], now), []);
});
test('filters a mixed list without modifying input', () => {
  const items = [quote('2026-09-28T10:00:00Z'), quote('2026-10-05T10:00:00Z'), quote('2026-09-01T10:00:00Z', 'accepted')];
  const original = structuredClone(items);
  assert.deepEqual(findQuotesForFollowUp(items, now), [items[0]]);
  assert.deepEqual(items, original);
});
test('compares timestamps across time zones', () => {
  const item = quote('2026-10-01T12:00:00+02:00');
  assert.deepEqual(findQuotesForFollowUp([item], now), [item]);
});
test('rejects an invalid reference date', () => {
  assert.throws(() => findQuotesForFollowUp([], 'invalid'), TypeError);
});
test('uses the current date by default', () => {
  assert.equal(findQuotesForFollowUp([quote('2000-01-01T00:00:00Z')]).length, 1);
});
