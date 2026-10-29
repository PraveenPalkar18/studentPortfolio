const PROJECT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const PRIORITY_CLASSES = {
  LOW: 'text-bg-secondary',
  MEDIUM: 'text-bg-warning',
  HIGH: 'text-bg-danger'
};

function getPriorityLabel(priority) {
  const normalizedPriority = PROJECT_PRIORITIES.includes(priority) ? priority : 'MEDIUM';
  return normalizedPriority[0] + normalizedPriority.slice(1).toLowerCase();
}

function getPriorityClass(priority) {
  return PRIORITY_CLASSES[PROJECT_PRIORITIES.includes(priority) ? priority : 'MEDIUM'];
}

module.exports = {
  PROJECT_PRIORITIES,
  getPriorityClass,
  getPriorityLabel
};
