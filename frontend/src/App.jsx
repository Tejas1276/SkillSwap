import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { TutorDashboard } from './pages/TutorDashboard';
import { SessionsPage } from './pages/SessionsPage';
import { ProgressPage } from './pages/ProgressPage';
import { AnimeAmbientBackdrop } from './components/AnimeHeroBackground';

function AppContent() {
  const { user, loading } = useAuth();
  const [viewMode, setViewMode] = useState('home'); // 'home' or 'dashboard'
  const [activeTab, setActiveTab] = useState('learner');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Skill Swap...
      </div>
    );
  }

  // 1. Home Page with Continuous Anime Slideshow
  if (viewMode === 'home') {
    return (
      <HomePage
        onStartDashboard={() => setViewMode('dashboard')}
      />
    );
  }

  // 2. Authentication if not logged in
  if (!user) {
    return (
      <>
        <AnimeAmbientBackdrop />
        <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
          <button
            onClick={() => setViewMode('home')}
            className="btn-outline"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', color: '#fff' }}
          >
            ← Back to Anime Story
          </button>
        </div>
        <AuthPage />
      </>
    );
  }

  // 3. Main Dashboard View
  return (
    <div className="app-layout">
      <AnimeAmbientBackdrop />
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoHome={() => setViewMode('home')}
      />
      <main className="main-content">
        {activeTab === 'learner' && <LearnerDashboard />}
        {activeTab === 'tutor' && <TutorDashboard />}
        {activeTab === 'sessions' && <SessionsPage />}
        {activeTab === 'progress' && <ProgressPage />}
      </main>
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
