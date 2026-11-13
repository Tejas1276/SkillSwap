const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillToLearnSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    lowercase: true,
  },
  targetProficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const skillToTeachSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    lowercase: true,
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  },
  hourlyCredits: {
    type: Number,
    default: 10,
    min: [0, 'Hourly credits cannot be negative'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'award',
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    avatar: {
      type: String,
      default: '/avatars/default.svg',
    },
    credits: {
      type: Number,
      default: 100,
      min: [0, 'Credits cannot be negative'],
    },
    credibilityScore: {
      type: Number,
      default: 70.0,
      min: [0, 'Credibility score cannot be negative'],
      max: [100, 'Credibility score maximum is 100'],
    },
    skillsToLearn: [skillToLearnSchema],
    skillsToTeach: [skillToTeachSchema],
    badges: [badgeSchema],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Omit sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Index for searching tutors by skill and availability
userSchema.index({ 'skillsToTeach.skill': 1, isAvailable: 1 });
userSchema.index({ 'skillsToLearn.skill': 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
