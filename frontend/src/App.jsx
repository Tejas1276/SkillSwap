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
  const [showDemoNav, setShowDemoNav] = useState(true);

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

      {/* Floating Presentation Helper: Direct 1-Click Screen Switcher */}
      {showDemoNav && (
        <aside
          aria-label="Presentation 9-Screen Switcher"
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
            borderRadius: '9999px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 9999,
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', paddingRight: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            9 Screens:
          </span>

          {[
            { id: 'home', num: '1', label: 'Landing' },
            { id: 'auth', num: '2', label: 'Sign Up' },
            { id: 'dashboard', num: '3', label: 'Dashboard' },
            { id: 'explore', num: '4', label: 'Explore' },
            { id: 'profile', num: '5', label: 'Profile' },
            { id: 'book', num: '6', label: 'Book' },
            { id: 'video', num: '7', label: 'Video Call' },
            { id: 'leaderboard', num: '8', label: 'Leaderboard' },
            { id: 'messages', num: '9', label: 'Messages' },
          ].map((screen) => {
            const isActive = activePage === screen.id || (screen.id === 'book' && activePage === 'sessions');
            return (
              <button
                key={screen.id}
                onClick={() => handleNavigate(screen.id)}
                style={{
                  background: isActive ? '#0d9488' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: isActive ? '1px solid #14b8a6' : '1px solid transparent',
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                title={`Jump directly to Screen ${screen.num}: ${screen.label}`}
              >
                <span style={{ opacity: 0.7, marginRight: '4px' }}>{screen.num}</span>
                <span>{screen.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setShowDemoNav(false)}
            style={{
              background: 'transparent',
              color: '#64748b',
              fontSize: '0.75rem',
              padding: '2px 6px',
              marginLeft: '4px',
              borderRadius: '50%',
            }}
            title="Minimize"
          >
            ✕
          </button>
        </aside>
      )}
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
