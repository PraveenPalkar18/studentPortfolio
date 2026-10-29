// routes/project.js
const express = require('express');
const { requireLogin } = require('../middleware/auth');
const Project = require('../models/Project');
const {
  buildProjectFilter,
  getDueDateStatus,
  getProjectSummary,
  normalizeProjectFilters
} = require('../utils/project-tracker');

const router = express.Router();

// List
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const filters = normalizeProjectFilters(req.query);
    const [projects, allProjects] = await Promise.all([
      Project.find(buildProjectFilter(req.user._id, filters))
        .sort({ dueDate: 1, createdAt: -1 })
        .lean(),
      Project.find({ student: req.user._id }).select('status dueDate').lean()
    ]);

    res.render('projects/index', {
      user: req.user,
      projects,
      filters,
      hasFilters: Boolean(filters.search || filters.status !== 'ALL'),
      summary: getProjectSummary(allProjects),
      getDueDateStatus
    });
  } catch (err) {
    next(err);
  }
});

// Create
router.post('/', requireLogin, async (req, res, next) => {
  const { title, description, status, dueDate } = req.body;
  try {
    await Project.create({
      student: req.user._id,
      title,
      description,
      status,
      dueDate: dueDate || null
    });
    res.redirect('/projects');
  } catch (err) {
    next(err);
  }
});

// Edit form
router.get('/:id/edit', requireLogin, async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      student: req.user._id
    }).lean();
    if (!project) return res.redirect('/projects');
    res.render('projects/edit', { user: req.user, project });
  } catch (err) {
    next(err);
  }
});

// Update
router.put('/:id', requireLogin, async (req, res, next) => {
  const { title, description, status, dueDate } = req.body;
  try {
    await Project.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      { title, description, status, dueDate: dueDate || null },
      { runValidators: true }
    );
    res.redirect('/projects');
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', requireLogin, async (req, res, next) => {
  try {
    await Project.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id
    });
    res.redirect('/projects');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
