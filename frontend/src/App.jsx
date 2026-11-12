import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MasterNavbar } from './components/MasterNavbar';

// 9 Master Screens matching user's master design mockup
import { LandingPage } from './pages/LandingPage';           // Screen 1: Landing
import { AuthPage } from './pages/AuthPage';                 // Screen 2: Sign Up / Login
import { StudentDashboard } from './pages/StudentDashboard'; // Screen 3: Dashboard
import { ExplorePage } from './pages/ExplorePage';           // Screen 4: Explore Tutors
import { TutorProfilePage } from './pages/TutorProfilePage'; // Screen 5: Tutor Profile
import { BookSessionPage } from './pages/BookSessionPage';   // Screen 6: Book a Session
import { VideoRoomPage } from './pages/VideoRoomPage';       // Screen 7: WebRTC In-Session Call
import { LeaderboardPage } from './pages/LeaderboardPage';   // Screen 8: Leaderboard & Badges
import { MessagesPage } from './pages/MessagesPage';         // Screen 9: Messages / Chat

function AppContent() {
  const { user } = useAuth();
  // Default to 'home' (Screen 1) or 'dashboard' (Screen 3) if already logged in
  const [activePage, setActivePage] = useState('home');
  const [selectedTutor, setSelectedTutor] = useState({
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    handle: '@rohansharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    skill: 'Web Development',
    headline: 'B.Tech CSE | Web Developer | Love building products',
    rating: 4.8,
    sessionsCount: 23,
    studentsCount: '120+',
    badgesCount: 3,
    about: "Hey! I'm Rohan, a 3rd year CSE student. I love web development and have built multiple projects using React and Node.js. I'm here to help you learn and build your own projects! Let's grow together.",
    skillsToTeach: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git & GitHub'],
  });
  const [activeVideoSession, setActiveVideoSession] = useState(null);
  const [initialSearch, setInitialSearch] = useState('');

  // Handlers
  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
  };

  const handleBookTutor = (tutor) => {
    setSelectedTutor(tutor);
    setActivePage('book');
  };

  const handleEnterVideoRoom = (session) => {
    setActiveVideoSession(session || {
      tutorName: selectedTutor?.name || 'Rohan Sharma',
      skill: selectedTutor?.skill || 'Web Development',
      roomId: 'room-session-default',
    });
    setActivePage('video');
  };

  const handleSearchSkill = (skill) => {
    setInitialSearch(skill);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navbar (Master Design System) - Hidden only in Screen 7 Theater Mode */}
      {activePage !== 'video' && (
        <MasterNavbar
          activePage={activePage}
          setActivePage={handleNavigate}
        />
      )}

      {/* Main Screen Views */}
      <div style={{ flex: 1 }}>
        {/* Screen 1: Landing Page */}
        {activePage === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSearchSkill={handleSearchSkill}
            onSelectTutor={handleSelectTutor}
            onBookTutor={handleBookTutor}
          />
        )}

        {/* Screen 2: Sign Up / Auth Page */}
        {activePage === 'auth' && (
          <AuthPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Screen 3: Student Dashboard */}
        {activePage === 'dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectTutor={handleSelectTutor}
            onBookTutor={handleBookTutor}
            onEnterVideoRoom={handleEnterVideoRoom}
          />
        )}

        {/* Screen 4: Explore Page */}
        {activePage === 'explore' && (
          <ExplorePage
            onNavigate={handleNavigate}
            onSelectTutor={handleSelectTutor}
            onBookTutor={handleBookTutor}
            initialSearch={initialSearch}
          />
        )}

        {/* Screen 5: Tutor Profile View */}
        {activePage === 'profile' && (
          <TutorProfilePage
            tutor={selectedTutor}
            onBookTutor={handleBookTutor}
            onNavigate={handleNavigate}
          />
        )}

        {/* Screen 6: Book a Session Page */}
        {(activePage === 'book' || activePage === 'sessions') && (
          <BookSessionPage
            tutor={selectedTutor}
            onNavigate={handleNavigate}
            onEnterVideoRoom={handleEnterVideoRoom}
          />
        )}

        {/* Screen 7: WebRTC In-Session Video Room */}
        {activePage === 'video' && (
          <VideoRoomPage
            sessionInfo={activeVideoSession}
            onEndSession={() => handleNavigate('dashboard')}
            onNavigate={handleNavigate}
          />
        )}

        {/* Screen 8: Leaderboard & Progress */}
        {activePage === 'leaderboard' && (
          <LeaderboardPage />
        )}

        {/* Screen 9: Messages / Chat */}
        {activePage === 'messages' && (
          <MessagesPage
            onEnterVideoRoom={handleEnterVideoRoom}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
