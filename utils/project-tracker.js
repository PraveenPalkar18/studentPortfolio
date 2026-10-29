const PROJECT_STATUSES = ['PENDING', 'COMPLETED'];
const SEARCH_LIMIT = 100;

function normalizeProjectFilters(query = {}) {
  const search = typeof query.q === 'string'
    ? query.q.trim().slice(0, SEARCH_LIMIT)
    : '';
  const requestedStatus = typeof query.status === 'string'
    ? query.status.toUpperCase()
    : 'ALL';
  const status = PROJECT_STATUSES.includes(requestedStatus)
    ? requestedStatus
    : 'ALL';

  return { search, status };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildProjectFilter(studentId, filters) {
  const mongoFilter = { student: studentId };

  if (filters.status !== 'ALL') {
    mongoFilter.status = filters.status;
  }

  if (filters.search) {
    const search = new RegExp(escapeRegex(filters.search), 'i');
    mongoFilter.$or = [{ title: search }, { description: search }];
  }

  return mongoFilter;
}

function getDueDateStatus(dueDate, status, now = new Date()) {
  if (status === 'COMPLETED') return 'completed';
  if (!dueDate) return 'no-date';

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 'no-date';

  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const sevenDaysFromToday = today + 7 * 24 * 60 * 60 * 1000;

  if (dueDay < today) return 'overdue';
  if (dueDay <= sevenDaysFromToday) return 'due-soon';
  return 'upcoming';
}

function getProjectSummary(projects, now = new Date()) {
  return projects.reduce((summary, project) => {
    summary.total += 1;
    if (project.status === 'COMPLETED') {
      summary.completed += 1;
    } else {
      summary.pending += 1;
    }

    const dueDateStatus = getDueDateStatus(project.dueDate, project.status, now);
    if (dueDateStatus === 'overdue') summary.overdue += 1;
    if (dueDateStatus === 'due-soon') summary.dueSoon += 1;
    return summary;
  }, { total: 0, pending: 0, completed: 0, overdue: 0, dueSoon: 0 });
}

module.exports = {
  buildProjectFilter,
  getDueDateStatus,
  getProjectSummary,
  normalizeProjectFilters
};
