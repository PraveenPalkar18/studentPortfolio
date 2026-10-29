// routes/dashboard.js
const express = require('express');
const { requireLogin } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Project = require('../models/Project');
const { getDueDateStatus, getProjectSummary } = require('../utils/project-tracker');

const router = express.Router();

router.get('/', requireLogin, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).lean();
    const projects = await Project.find({ student: req.user._id })
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    res.render('dashboard/index', {
      user: req.user,
      enrollments,
      projects,
      projectSummary: getProjectSummary(projects),
      getDueDateStatus
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
