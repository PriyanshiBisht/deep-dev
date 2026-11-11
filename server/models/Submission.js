const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: Number, required: true },
  allPassed: { type: Boolean, required: true },
}, { timestamps: true });

submissionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);