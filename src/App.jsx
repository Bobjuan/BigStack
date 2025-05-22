import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Pages
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import CashGamePage from './pages/game/CashGamePage';
import HeadsUpPage from './pages/game/HeadsUpPage';
import GTOTrainerPage from './pages/game/GTOTrainerPage';
import TournamentPage from './pages/game/TournamentPage';
import QuizPage from './pages/learn/QuizPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#1b1f2b] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/cash-game" element={
            <ProtectedRoute>
              <CashGamePage />
            </ProtectedRoute>
          } />
          <Route path="/heads-up" element={
            <ProtectedRoute>
              <HeadsUpPage />
            </ProtectedRoute>
          } />
          <Route path="/gto-trainer" element={
            <ProtectedRoute>
              <GTOTrainerPage />
            </ProtectedRoute>
          } />
          <Route path="/tournament" element={
            <ProtectedRoute>
              <TournamentPage />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
