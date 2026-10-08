const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session is required'],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewee is required'],
    },
    role: {
      type: String,
      enum: ['learner', 'tutor'],
      required: [true, 'Role of reviewer is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      default: '',
    },
    criteria: {
      clarity: { type: Number, min: 1, max: 5, default: 5 },
      helpfulness: { type: Number, min: 1, max: 5, default: 5 },
      punctuality: { type: Number, min: 1, max: 5, default: 5 },
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ session: 1, reviewer: 1 }, { unique: true });
feedbackSchema.index({ reviewee: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
