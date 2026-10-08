const mongoose = require('mongoose');
const { v4: uuidv4 } = require('crypto');

const sessionSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Learner is required'],
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tutor is required'],
    },
    skill: {
      type: String,
      required: [true, 'Skill is required'],
      trim: true,
      lowercase: true,
    },
    topic: {
      type: String,
      trim: true,
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled time is required'],
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: [15, 'Session must be at least 15 minutes'],
      max: [240, 'Session cannot exceed 4 hours'],
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    creditsExchanged: {
      type: Number,
      default: 10,
      min: [0, 'Credits cannot be negative'],
    },
    meetingRoomId: {
      type: String,
      unique: true,
      default: () => `room-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`,
    },
    learnerNotes: {
      type: String,
      trim: true,
      default: '',
    },
    tutorNotes: {
      type: String,
      trim: true,
      default: '',
    },
    learnerFeedbackCompleted: {
      type: Boolean,
      default: false,
    },
    tutorFeedbackCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ learner: 1, scheduledAt: -1 });
sessionSchema.index({ tutor: 1, scheduledAt: -1 });
sessionSchema.index({ status: 1 });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
