const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    type: {
      type: String,
      enum: ['credit_earned', 'credit_spent', 'badge_unlocked', 'credibility_updated', 'bonus_received'],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    balanceAfter: {
      type: Number,
      default: 0,
    },
    badgeName: {
      type: String,
    },
    credibilityDelta: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  },
  {
    timestamps: true,
  }
);

gamificationSchema.index({ user: 1, createdAt: -1 });

const Gamification = mongoose.model('Gamification', gamificationSchema);
module.exports = Gamification;
