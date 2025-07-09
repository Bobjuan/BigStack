import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PlayPage from './pages/game/PlayPage';
import PlayWithFriendsPage from './pages/game/PlayWithFriendsPage';
import CashGamePage from './pages/game/CashGamePage';
import HeadsUpPage from './pages/game/HeadsUpPage';
import BotHeadsUpPage from './pages/game/BotHeadsUpPage';
import GTOTrainerPage from './pages/game/GTOTrainerPage';
import TournamentPage from './pages/game/TournamentPage';
import DeepStackPage from './pages/game/DeepStackPage';
import QuizPage from './pages/learn/QuizPage';
import LearnPage from './pages/learn/LearnPage';
import CoursePage from './pages/learn/CoursePage';
import ModulesPage from './pages/learn/ModulesPage';
import LessonPage from './pages/learn/LessonPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PricingPage from './pages/PricingPage';
import ProductPage from './pages/ProductPage';
import ResourcesPage from './pages/ResourcesPage';
import CustomersPage from './pages/CustomersPage';
import PracticeMenuPage from './pages/learn/practice/PracticeMenuPage';
import PracticeScenarioPage from './pages/learn/practice/PracticeScenarioPage';
import MainLayout from './components/layout/MainLayout';
import AiReviewPage from './pages/AiReviewPage';
import FloatingChatWidget from './components/ai-review/FloatingChatWidget';

function AppRoutes() {
  const location = useLocation();
  const path = location.pathname;

  // Helper: Only show chat widget if not on bot/liveplay/lesson pages
  const isChatWidgetAllowed = () => {
    // Exclude AI review page
    if (path.startsWith('/ai-review')) return false;
    // Exclude lessons with built-in chat
    if (path.startsWith('/learn/lessons')) return false;
    // Exclude live play pages
    if (
      path.startsWith('/play') ||
      path.startsWith('/cash-game') ||
      path.startsWith('/heads-up') ||
      path.startsWith('/deep-stack') ||
      path.startsWith('/tournament') ||
      path.startsWith('/play-with-friends')
    ) return false;
    // Exclude practice mode
    if (path.startsWith('/learn/practice')) return false;
    return true;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/ai-review" element={<AiReviewPage />} />

      {/* Protected routes with MainLayout */}
      <Route path="/dashboard" element={
          <ProtectedRoute>
          <MainLayout>
            <DashboardPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/play" element={
          <ProtectedRoute>
          <MainLayout>
            <PlayPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/play-with-friends" element={
          <ProtectedRoute>
          <MainLayout>
            <PlayWithFriendsPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/play-with-friends/:gameId?" element={
          <ProtectedRoute>
          <MainLayout>
            <PlayWithFriendsPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/cash-game" element={
          <ProtectedRoute>
          <MainLayout>
            <CashGamePage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/heads-up" element={
          <ProtectedRoute>
          <MainLayout>
            <HeadsUpPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/play-bot-heads-up" element={
          <ProtectedRoute>
          <MainLayout>
            <BotHeadsUpPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/deep-stack" element={
          <ProtectedRoute>
          <MainLayout>
            <DeepStackPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/gto-trainer" element={
          <ProtectedRoute>
          <MainLayout>
            <GTOTrainerPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/tournament" element={
          <ProtectedRoute>
          <MainLayout>
            <TournamentPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/learn" element={
          <ProtectedRoute>
          <MainLayout>
            <LearnPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/learn/course/:courseId" element={
          <ProtectedRoute>
          <MainLayout>
            <ModulesPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/learn/course/:courseId/module/:moduleId" element={
          <ProtectedRoute>
          <MainLayout>
            <CoursePage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/learn/course/:courseId/module/:moduleId/lesson/:lessonId" element={
        <ProtectedRoute>
          <MainLayout>
            <LessonPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/learn/lessons/:lessonId" element={
          <ProtectedRoute>
          <MainLayout>
            <LessonPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/quiz" element={
          <ProtectedRoute>
          <MainLayout>
            <QuizPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="/profile" element={
          <ProtectedRoute>
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/learn/practice" element={
        <ProtectedRoute>
          <MainLayout>
            <PracticeMenuPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/learn/practice/:scenarioId" element={
        <ProtectedRoute>
          <MainLayout>
            <PracticeScenarioPage />
          </MainLayout>
          </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const location = useLocation();
  const path = location.pathname;

  // Helper: Only show chat widget if not on bot/liveplay/lesson pages
  const isChatWidgetAllowed = () => {
    // Exclude AI review page
    if (path.startsWith('/ai-review')) return false;
    // Exclude lessons with built-in chat
    if (path.startsWith('/learn/lessons')) return false;
    // Exclude live play pages
    if (
      path.startsWith('/play') ||
      path.startsWith('/cash-game') ||
      path.startsWith('/heads-up') ||
      path.startsWith('/play-bot-heads-up') ||
      path.startsWith('/deep-stack') ||
      path.startsWith('/tournament') ||
      path.startsWith('/play-with-friends')
    ) return false;
    // Exclude practice mode
    if (path.startsWith('/learn/practice')) return false;
    return true;
  };

  return (
    <>
      <AppRoutes />
      {isChatWidgetAllowed() && <FloatingChatWidget />}
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
