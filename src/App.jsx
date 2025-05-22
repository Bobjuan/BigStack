import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PlayPage from './pages/game/PlayPage';
import PlayWithFriendsPage from './pages/game/PlayWithFriendsPage';
import CashGamePage from './pages/game/CashGamePage';
import HeadsUpPage from './pages/game/HeadsUpPage';
import GTOTrainerPage from './pages/game/GTOTrainerPage';
import TournamentPage from './pages/game/TournamentPage';
import QuizPage from './pages/learn/QuizPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play"
            element={
              <ProtectedRoute>
                <PlayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <PlayWithFriendsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cash-game"
            element={
              <ProtectedRoute>
                <CashGamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/heads-up"
            element={
              <ProtectedRoute>
                <HeadsUpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gto-trainer"
            element={
              <ProtectedRoute>
                <GTOTrainerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournament"
            element={
              <ProtectedRoute>
                <TournamentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
