const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildProjectFilter,
  getDueDateStatus,
  getProjectSummary,
  normalizeProjectFilters
} = require('../utils/project-tracker');

test('normalizes search and accepts only known project statuses', () => {
  assert.deepEqual(normalizeProjectFilters({ q: '  Portfolio  ', status: 'pending' }), {
    search: 'Portfolio',
    status: 'PENDING'
  });
  assert.deepEqual(normalizeProjectFilters({ q: 'x'.repeat(120), status: 'INVALID' }), {
    search: 'x'.repeat(100),
    status: 'ALL'
  });
});

test('builds a student-scoped search filter with literal search text', () => {
  const filter = buildProjectFilter('student-id', {
    search: 'site.*',
    status: 'COMPLETED'
  });

  assert.equal(filter.student, 'student-id');
  assert.equal(filter.status, 'COMPLETED');
  assert.equal(filter.$or[0].title.source, 'site\\.\\*');
  assert.equal(filter.$or[1].description.flags, 'i');
});

test('classifies due dates against UTC calendar days', () => {
  const now = new Date('2026-10-29T10:00:00Z');

  assert.equal(getDueDateStatus('2026-10-28T00:00:00Z', 'PENDING', now), 'overdue');
  assert.equal(getDueDateStatus('2026-11-05T00:00:00Z', 'PENDING', now), 'due-soon');
  assert.equal(getDueDateStatus('2026-11-06T00:00:00Z', 'PENDING', now), 'upcoming');
  assert.equal(getDueDateStatus(null, 'PENDING', now), 'no-date');
  assert.equal(getDueDateStatus('2026-10-28T00:00:00Z', 'COMPLETED', now), 'completed');
});

test('summarizes project counts and active deadlines', () => {
  const summary = getProjectSummary([
    { status: 'PENDING', dueDate: '2026-10-28T00:00:00Z' },
    { status: 'PENDING', dueDate: '2026-11-02T00:00:00Z' },
    { status: 'COMPLETED', dueDate: '2026-10-28T00:00:00Z' }
  ], new Date('2026-10-29T10:00:00Z'));

  assert.deepEqual(summary, {
    total: 3,
    pending: 2,
    completed: 1,
    overdue: 1,
    dueSoon: 1
  });
});
