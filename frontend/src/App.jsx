import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { TutorDashboard } from './pages/TutorDashboard';
import { SessionsPage } from './pages/SessionsPage';
import { ProgressPage } from './pages/ProgressPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('learner');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
      }}>
        Loading Skill Swap...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
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
