const test = require('node:test');
const assert = require('node:assert/strict');
const {
  PROJECT_PRIORITIES,
  getPriorityClass,
  getPriorityLabel
} = require('../utils/project-priority');

test('exposes supported project priorities in ascending order', () => {
  assert.deepEqual(PROJECT_PRIORITIES, ['LOW', 'MEDIUM', 'HIGH']);
});

test('formats priority labels and badge styles', () => {
  assert.equal(getPriorityLabel('HIGH'), 'High');
  assert.equal(getPriorityClass('HIGH'), 'text-bg-danger');
  assert.equal(getPriorityLabel('LOW'), 'Low');
  assert.equal(getPriorityClass('LOW'), 'text-bg-secondary');
});

test('uses medium priority styling for projects without a priority', () => {
  assert.equal(getPriorityLabel(undefined), 'Medium');
  assert.equal(getPriorityClass(undefined), 'text-bg-warning');
});
