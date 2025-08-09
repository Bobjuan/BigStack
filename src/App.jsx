import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PreLaunchPage from './pages/PreLaunchPage';
import ProductMarketingPage from './pages/ProductMarketingPage';
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
import DnaAnalysisPage from './pages/DnaAnalysisPage';
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
import HandReviewPage from './pages/HandReviewPage';
import HandHistoryListPage from './pages/HandHistoryListPage';
import Bot6MaxPage from './pages/game/Bot6MaxPage';
import Bot9MaxPage from './pages/game/Bot9MaxPage';

// Combined ProtectedRoute + MainLayout for authenticated pages
function AuthenticatedPage({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public marketing root and pre-launch gate */}
          <Route path="/" element={<ProductPage />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes with MainLayout */}
          <Route path="/dashboard" element={<AuthenticatedPage><DashboardPage /></AuthenticatedPage>} />
          <Route path="/profile" element={<AuthenticatedPage><ProfilePage /></AuthenticatedPage>} />
          <Route path="/dna-analysis" element={<AuthenticatedPage><DnaAnalysisPage /></AuthenticatedPage>} />
          
          {/* Play Routes */}
          <Route path="/play" element={<AuthenticatedPage><PlayPage /></AuthenticatedPage>} />
          <Route path="/play/6-max-bot" element={<AuthenticatedPage><Bot6MaxPage /></AuthenticatedPage>} />
          <Route path="/play/9-max-bot" element={<AuthenticatedPage><Bot9MaxPage /></AuthenticatedPage>} />
          <Route path="/play/heads-up-bot" element={<AuthenticatedPage><BotHeadsUpPage /></AuthenticatedPage>} />
          <Route path="/play/friends" element={<AuthenticatedPage><PlayWithFriendsPage /></AuthenticatedPage>} />
          <Route path="/play/friends/:gameId" element={<AuthenticatedPage><PlayWithFriendsPage /></AuthenticatedPage>} />
          <Route path="/play/cash-game" element={<AuthenticatedPage><CashGamePage /></AuthenticatedPage>} />
          <Route path="/play/heads-up" element={<AuthenticatedPage><HeadsUpPage /></AuthenticatedPage>} />
          <Route path="/play/deep-stack" element={<AuthenticatedPage><DeepStackPage /></AuthenticatedPage>} />
          <Route path="/play/gto-trainer" element={<AuthenticatedPage><GTOTrainerPage /></AuthenticatedPage>} />
          <Route path="/play/tournament" element={<AuthenticatedPage><TournamentPage /></AuthenticatedPage>} />

          {/* Learn Routes */}
          <Route path="/learn" element={<AuthenticatedPage><LearnPage /></AuthenticatedPage>} />
          <Route path="/learn/course/:courseId" element={<AuthenticatedPage><ModulesPage /></AuthenticatedPage>} />
          <Route path="/learn/course/:courseId/module/:moduleId" element={<AuthenticatedPage><CoursePage /></AuthenticatedPage>} />
          <Route path="/learn/course/:courseId/module/:moduleId/lesson/:lessonId" element={<AuthenticatedPage><LessonPage /></AuthenticatedPage>} />
          <Route path="/learn/lessons/:lessonId" element={<AuthenticatedPage><LessonPage /></AuthenticatedPage>} />
          <Route path="/learn/quiz" element={<AuthenticatedPage><QuizPage /></AuthenticatedPage>} />
          <Route path="/learn/practice" element={<AuthenticatedPage><PracticeMenuPage /></AuthenticatedPage>} />
          <Route path="/learn/practice/:scenarioId" element={<AuthenticatedPage><PracticeScenarioPage /></AuthenticatedPage>} />

          {/* Hand Review */}
          <Route path="/hand/:handId" element={<AuthenticatedPage><HandReviewPage /></AuthenticatedPage>} />
          <Route path="/hands" element={<AuthenticatedPage><HandHistoryListPage /></AuthenticatedPage>} />

          {/* Other Routes */}
          <Route path="/ai-review" element={<AuthenticatedPage><AiReviewPage /></AuthenticatedPage>} />
          <Route path="/contact" element={<AuthenticatedPage><ContactPage /></AuthenticatedPage>} />
          <Route path="/pricing" element={<AuthenticatedPage><PricingPage /></AuthenticatedPage>} />
          <Route path="/product" element={<AuthenticatedPage><ProductPage /></AuthenticatedPage>} />
          <Route path="/resources" element={<AuthenticatedPage><ResourcesPage /></AuthenticatedPage>} />
          <Route path="/customers" element={<AuthenticatedPage><CustomersPage /></AuthenticatedPage>} />

          {/* Redirect any other path to the welcome page */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
