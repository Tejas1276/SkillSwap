import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MasterNavbar } from './components/MasterNavbar';

// 9 Master Screens matching Collegiate Academic Theme
import { LandingPage } from './pages/LandingPage';           // Screen 1: Landing
import { AuthPage } from './pages/AuthPage';                 // Screen 2: Sign Up / Login
import { StudentDashboard } from './pages/StudentDashboard'; // Screen 3: Dashboard
import { ExplorePage } from './pages/ExplorePage';           // Screen 4: Explore Tutors
import { TutorProfilePage } from './pages/TutorProfilePage'; // Screen 5: Tutor Profile
import { BookSessionPage } from './pages/BookSessionPage';   // Screen 6: Book a Session
import { SessionsPage } from './pages/SessionsPage';         // Live Session Schedule & Feedback
import { VideoRoomPage } from './pages/VideoRoomPage';       // Screen 7: WebRTC In-Session Call
import { LeaderboardPage } from './pages/LeaderboardPage';   // Screen 8: Leaderboard & Badges
import { MessagesPage } from './pages/MessagesPage';         // Screen 9: Messages / Chat

function AppContent() {
  const { user, oauthRedirectTarget, clearOauthRedirect } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [sessionsSubTab, setSessionsSubTab] = useState('book'); // 'book' | 'manage'
  const [selectedTutor, setSelectedTutor] = useState({
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    handle: '@rohansharma',
    avatar: '/avatars/rohan.svg',
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
  const [messageContactName, setMessageContactName] = useState('');
  const [latestBooking, setLatestBooking] = useState(null);
  const [bookmarkedTutorIds, setBookmarkedTutorIds] = useState(['rohan-sharma', 'priya-singh']);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    if (oauthRedirectTarget === 'dashboard') {
      setActivePage('dashboard');
      clearOauthRedirect();
    } else if (oauthRedirectTarget === 'login') {
      setAuthMode('login');
      setActivePage('auth');
      clearOauthRedirect();
    }
  }, [oauthRedirectTarget, clearOauthRedirect]);

  const handleNavigate = (page) => {
    if (page === 'login' || page === 'auth-login') {
      setAuthMode('login');
      setActivePage('auth');
    } else if (page === 'signup' || page === 'auth-signup' || page === 'auth') {
      setAuthMode('signup');
      setActivePage('auth');
    } else {
      setActivePage(page);
    }
    if (page === 'book') {
      setSessionsSubTab('book');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
  };

  const handleBookTutor = (tutor) => {
    setSelectedTutor(tutor);
    setSessionsSubTab('book');
    setActivePage('book');
  };

  const handleEnterVideoRoom = (session) => {
    setActiveVideoSession(
      session || {
        tutorName: selectedTutor?.name || 'Rohan Sharma',
        skill: selectedTutor?.skill || 'Web Development',
        roomId: 'room-skillswap-demo',
      }
    );
    setActivePage('video');
  };

  const handleMessageTutor = (tutorName) => {
    setMessageContactName(tutorName);
    setActivePage('messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmarkTutor = (tutorId) => {
    setBookmarkedTutorIds((prev) =>
      prev.includes(tutorId) ? prev.filter((id) => id !== tutorId) : [...prev, tutorId]
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navbar (Hidden only in Screen 7 Theater Mode) */}
      {activePage !== 'video' && (
        <MasterNavbar activePage={activePage} setActivePage={handleNavigate} />
      )}

      {/* Main Screen Views */}
      <div style={{ flex: 1 }}>
        {/* Screen 1: Landing Page */}
        {activePage === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSearchSkill={(skill) => setInitialSearch(skill)}
            onSelectTutor={handleSelectTutor}
            onBookTutor={handleBookTutor}
          />
        )}

        {/* Screen 2: Sign Up / Auth Page */}
        {activePage === 'auth' && <AuthPage onNavigate={handleNavigate} initialMode={authMode} />}

        {/* Screen 3: Student Dashboard */}
        {activePage === 'dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectTutor={handleSelectTutor}
            onBookTutor={handleBookTutor}
            onEnterVideoRoom={handleEnterVideoRoom}
            latestBooking={latestBooking}
            bookmarkedTutorIds={bookmarkedTutorIds}
            onToggleBookmark={toggleBookmarkTutor}
          />
        )}

        {/* Screen 4: Explore Page */}
        {activePage === 'explore' && (
          <ExplorePage
            onNavigate={handleNavigate}
            onSelectTutor={handleSelectTutor}
            onBookTutor={handleBookTutor}
            initialSearch={initialSearch}
            bookmarkedTutorIds={bookmarkedTutorIds}
            onToggleBookmark={toggleBookmarkTutor}
          />
        )}

        {/* Screen 5: Tutor Profile View */}
        {activePage === 'profile' && (
          <TutorProfilePage
            tutor={selectedTutor}
            onBookTutor={handleBookTutor}
            onNavigate={handleNavigate}
            onMessageTutor={handleMessageTutor}
          />
        )}

        {/* Screen 6: Book a Session & Live Scheduled Sessions */}
        {(activePage === 'book' || activePage === 'sessions') && (
          <div>
            {activePage === 'sessions' && (
              <div
                style={{
                  maxWidth: '1040px',
                  margin: '20px auto 0',
                  padding: '0 20px',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSessionsSubTab('book')}
                  className={sessionsSubTab === 'book' ? 'btn-teal' : 'btn-outline-gray'}
                >
                  Book a Session
                </button>
                <button
                  type="button"
                  onClick={() => setSessionsSubTab('manage')}
                  className={sessionsSubTab === 'manage' ? 'btn-teal' : 'btn-outline-gray'}
                >
                  My Scheduled Sessions {user ? '' : '(Sign in required)'}
                </button>
              </div>
            )}

            {activePage === 'book' || sessionsSubTab === 'book' ? (
              <BookSessionPage
                tutor={selectedTutor}
                onNavigate={handleNavigate}
                onEnterVideoRoom={handleEnterVideoRoom}
                onBookingCreated={(booking) => setLatestBooking(booking)}
              />
            ) : (
              <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 20px 60px' }}>
                {user ? (
                  <SessionsPage onEnterVideoRoom={handleEnterVideoRoom} />
                ) : (
                  <div className="clean-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                      Sign in to manage scheduled sessions
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>
                      Log in as Tejas, Rohan, or Priya to view, accept, complete, and rate real database sessions.
                    </p>
                    <button onClick={() => handleNavigate('auth')} className="btn-teal">
                      Go to Login / Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
        {activePage === 'leaderboard' && <LeaderboardPage />}

        {/* Screen 9: Messages / Chat */}
        {activePage === 'messages' && (
          <MessagesPage
            onEnterVideoRoom={handleEnterVideoRoom}
            onNavigate={handleNavigate}
            initialContactName={messageContactName}
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
