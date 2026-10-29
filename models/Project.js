// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED'],
      default: 'PENDING'
    },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
