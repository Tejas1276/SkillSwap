const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Session = require('./models/Session');
const Feedback = require('./models/Feedback');
const Gamification = require('./models/Gamification');
const { connectDB, disconnectDB } = require('./config/db');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Session.deleteMany({}),
      Feedback.deleteMany({}),
      Gamification.deleteMany({}),
    ]);

    console.log('[Seed] Seeding sample users (learners & tutors)...');

    // 1. User: Sarah Chen (Full-stack developer teaching React & Node, learning UI/UX)
    const sarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@skillswap.io',
      password: 'password123',
      bio: 'Senior full-stack engineer passionate about mentorship and front-end architectures.',
      avatar: '/avatars/sarah.svg',
      credits: 140,
      credibilityScore: 92.5,
      isAvailable: true,
      skillsToTeach: [
        {
          skill: 'react',
          proficiency: 'expert',
          hourlyCredits: 20,
          description: 'Modern React 19, Hooks, Redux Toolkit, and Next.js',
          verified: true,
        },
        {
          skill: 'nodejs',
          proficiency: 'advanced',
          hourlyCredits: 15,
          description: 'RESTful API design, Express, authentication, MongoDB',
          verified: true,
        },
      ],
      skillsToLearn: [
        {
          skill: 'ui/ux design',
          targetProficiency: 'intermediate',
          notes: 'Looking to master Figma component design systems',
        },
      ],
      badges: [
        { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
        { name: 'Knowledge Sharer', description: 'Offered first skill', icon: 'book-open' },
        { name: 'Top Rated Peer', description: 'Maintained 4.5+ rating', icon: 'star' },
      ],
      rating: { average: 4.9, count: 18 },
    });

    // 2. User: Marcus Brody (Data Scientist teaching Python & ML, learning React)
    const marcus = await User.create({
      name: 'Marcus Brody',
      email: 'marcus@skillswap.io',
      password: 'password123',
      bio: 'Data Scientist specializing in Python, Scikit-learn, and Deep Learning.',
      avatar: '/avatars/marcus.svg',
      credits: 110,
      credibilityScore: 88.0,
      isAvailable: true,
      skillsToTeach: [
        {
          skill: 'python',
          proficiency: 'expert',
          hourlyCredits: 25,
          description: 'Python fundamentals, Data Analysis with Pandas, ML algorithms',
          verified: true,
        },
        {
          skill: 'machine learning',
          proficiency: 'advanced',
          hourlyCredits: 30,
          description: 'Supervised/unsupervised learning, scikit-learn models',
          verified: true,
        },
      ],
      skillsToLearn: [
        {
          skill: 'react',
          targetProficiency: 'intermediate',
          notes: 'Building dashboard frontends for AI models',
        },
      ],
      badges: [
        { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
        { name: 'Knowledge Sharer', description: 'Offered first skill', icon: 'book-open' },
      ],
      rating: { average: 4.7, count: 12 },
    });

    // 3. User: Elena Gomez (UI/UX Designer teaching Figma, learning Python)
    const elena = await User.create({
      name: 'Elena Gomez',
      email: 'elena@skillswap.io',
      password: 'password123',
      bio: 'Product Designer with 6+ years creating intuitive mobile & web experiences.',
      avatar: '/avatars/elena.svg',
      credits: 95,
      credibilityScore: 85.0,
      isAvailable: true,
      skillsToTeach: [
        {
          skill: 'ui/ux design',
          proficiency: 'expert',
          hourlyCredits: 20,
          description: 'Figma prototyping, design tokens, wireframing, usability testing',
          verified: true,
        },
      ],
      skillsToLearn: [
        {
          skill: 'python',
          targetProficiency: 'beginner',
          notes: 'Learning Python scripting for creative automation',
        },
      ],
      badges: [
        { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
        { name: 'Knowledge Sharer', description: 'Offered first skill', icon: 'book-open' },
      ],
      rating: { average: 4.8, count: 9 },
    });

    console.log('[Seed] Seeding sample session...');
    const tomorrow = new Date(Date.now() + 86400000);
    const session = await Session.create({
      learner: marcus._id,
      tutor: sarah._id,
      skill: 'react',
      topic: 'React 19 Server Components & Custom Hooks',
      scheduledAt: tomorrow,
      durationMinutes: 60,
      creditsExchanged: 20,
      status: 'accepted',
      learnerNotes: 'Need help structuring state in a complex data visualizer',
      meetingRoomId: 'room-react-demo-session-2026',
    });

    console.log('[Seed] Seeding completed feedback...');
    const pastDate = new Date(Date.now() - 86400000 * 3);
    const completedSession = await Session.create({
      learner: elena._id,
      tutor: marcus._id,
      skill: 'python',
      topic: 'Introduction to Python Data Types and Functions',
      scheduledAt: pastDate,
      durationMinutes: 60,
      creditsExchanged: 25,
      status: 'completed',
      learnerFeedbackCompleted: true,
      meetingRoomId: 'room-past-session-python',
    });

    await Feedback.create({
      session: completedSession._id,
      reviewer: elena._id,
      reviewee: marcus._id,
      role: 'learner',
      rating: 5,
      comment: 'Marcus was patient and gave super intuitive real-world examples! Highly recommend.',
      criteria: { clarity: 5, helpfulness: 5, punctuality: 5 },
    });

    console.log('[Seed] Seeding completed successfully!');
    console.log('Sample Accounts (password: "password123"):');
    console.log(' - sarah@skillswap.io  (Tutor: React, Node | Learner: UI/UX)');
    console.log(' - marcus@skillswap.io (Tutor: Python, ML | Learner: React)');
    console.log(' - elena@skillswap.io  (Tutor: UI/UX      | Learner: Python)');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
