const User = require('../models/User');

const demoUsers = [
  {
    name: 'Tejas Kushwaha',
    email: 'tejas@skillswap.io',
    password: 'password123',
    bio: 'Computer Science Undergraduate & Fullstack Learner at Delhi Technological University',
    avatar: '/avatars/default.svg',
    credits: 150,
    credibilityScore: 88,
    rating: { average: 4.8, count: 12 },
    skillsToLearn: [
      { skill: 'react', targetProficiency: 'intermediate', notes: 'Mastering React state and hooks' },
      { skill: 'ui/ux design', targetProficiency: 'beginner', notes: 'Learning Figma prototyping' },
    ],
    skillsToTeach: [
      { skill: 'python', proficiency: 'intermediate', hourlyCredits: 10, description: 'Python scripting and backend data algorithms', verified: true },
    ],
    badges: [
      { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
      { name: 'Active Learner', description: 'Participated in learning sessions', icon: 'zap' },
    ],
  },
  {
    name: 'Rohan Sharma',
    email: 'rohan@skillswap.io',
    password: 'password123',
    bio: 'Senior Peer Tutor & React Specialist at IIT Delhi',
    avatar: '/avatars/marcus.svg',
    credits: 240,
    credibilityScore: 95,
    rating: { average: 4.9, count: 24 },
    skillsToTeach: [
      { skill: 'react', proficiency: 'expert', hourlyCredits: 15, description: 'Modern React 19, hooks, and clean state machines', verified: true },
      { skill: 'nodejs', proficiency: 'advanced', hourlyCredits: 15, description: 'Scalable REST APIs and real-time WebSockets', verified: true },
    ],
    skillsToLearn: [
      { skill: 'machine learning', targetProficiency: 'intermediate', notes: 'Integrating AI models' },
    ],
    badges: [
      { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
      { name: 'Top Rated Tutor', description: 'Maintained 4.9 rating across 20+ sessions', icon: 'star' },
      { name: 'Knowledge Sharer', description: 'Taught over 50 hours of sessions', icon: 'book-open' },
    ],
  },
  {
    name: 'Priya Singh',
    email: 'priya@skillswap.io',
    password: 'password123',
    bio: 'UI/UX Designer & Design Systems Mentor at NID',
    avatar: '/avatars/elena.svg',
    credits: 180,
    credibilityScore: 92,
    rating: { average: 4.8, count: 19 },
    skillsToTeach: [
      { skill: 'ui/ux design', proficiency: 'expert', hourlyCredits: 20, description: 'Figma UI design, tokens, wireframing, and user testing', verified: true },
    ],
    skillsToLearn: [
      { skill: 'react', targetProficiency: 'beginner', notes: 'Learning to build frontend components' },
    ],
    badges: [
      { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
      { name: 'Creative Mentor', description: 'Helped 15+ students with design portfolios', icon: 'award' },
    ],
  },
];

const ensureDemoUsers = async () => {
  try {
    for (const data of demoUsers) {
      let user = await User.findOne({ email: data.email }).select('+password');
      if (!user) {
        user = await User.create(data);
        console.log(`[Demo Users] Created demo user: ${data.name} (${data.email})`);
      } else {
        // Ensure password is always valid password123
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
          user.password = data.password;
          await user.save();
          console.log(`[Demo Users] Reset demo password for: ${data.email}`);
        }
      }
    }
  } catch (err) {
    console.warn('[Demo Users] Warning during ensureDemoUsers:', err.message);
  }
};

module.exports = { ensureDemoUsers, demoUsers };
