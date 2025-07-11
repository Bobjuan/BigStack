import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PreLaunchPage from './pages/PreLaunchPage';
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
import Bot6MaxPage from './pages/game/Bot6MaxPage';
import Bot9MaxPage from './pages/game/Bot9MaxPage';

// Component to check access and redirect appropriately
function AccessChecker({ children }) {
  const hasAccess = localStorage.getItem('bigstack_access') === 'granted';
  
  if (!hasAccess) {
    return <PreLaunchPage />;
  }
  
  return children;
}

// Combined AccessChecker + ProtectedRoute + MainLayout for authenticated pages
function AuthenticatedPage({ children }) {
  return (
    <AccessChecker>
      <ProtectedRoute>
        <MainLayout>
          {children}
        </MainLayout>
      </ProtectedRoute>
    </AccessChecker>
  );
}

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
      {/* Pre-launch landing page - always accessible */}
      <Route path="/" element={<PreLaunchPage />} />
      
      {/* Protected access routes */}
      <Route path="/welcome" element={<AccessChecker><LandingPage /></AccessChecker>} />
      <Route path="/login" element={<AccessChecker><LoginPage /></AccessChecker>} />
      <Route path="/signup" element={<AccessChecker><SignupPage /></AccessChecker>} />
      <Route path="/contact" element={<AccessChecker><ContactPage /></AccessChecker>} />
      <Route path="/pricing" element={<AccessChecker><PricingPage /></AccessChecker>} />
      <Route path="/product" element={<AccessChecker><ProductPage /></AccessChecker>} />
      <Route path="/resources" element={<AccessChecker><ResourcesPage /></AccessChecker>} />
      <Route path="/customers" element={<AccessChecker><CustomersPage /></AccessChecker>} />
      <Route path="/ai-review" element={<AccessChecker><AiReviewPage /></AccessChecker>} />

      {/* Protected routes with MainLayout */}
      <Route path="/dashboard" element={<AuthenticatedPage><DashboardPage /></AuthenticatedPage>} />
      <Route path="/play" element={<AuthenticatedPage><PlayPage /></AuthenticatedPage>} />
      <Route path="/play-with-friends" element={<AuthenticatedPage><PlayWithFriendsPage /></AuthenticatedPage>} />
      <Route path="/play-with-friends/:gameId?" element={<AuthenticatedPage><PlayWithFriendsPage /></AuthenticatedPage>} />
      <Route path="/cash-game" element={<AuthenticatedPage><CashGamePage /></AuthenticatedPage>} />
      <Route path="/heads-up" element={<AuthenticatedPage><HeadsUpPage /></AuthenticatedPage>} />
      <Route path="/play-bot-heads-up" element={<AuthenticatedPage><BotHeadsUpPage /></AuthenticatedPage>} />
      <Route path="/deep-stack" element={<AuthenticatedPage><DeepStackPage /></AuthenticatedPage>} />
      <Route path="/gto-trainer" element={<AuthenticatedPage><GTOTrainerPage /></AuthenticatedPage>} />
      <Route path="/tournament" element={<AuthenticatedPage><TournamentPage /></AuthenticatedPage>} />
      <Route path="/learn" element={<AuthenticatedPage><LearnPage /></AuthenticatedPage>} />
      <Route path="/learn/course/:courseId" element={<AuthenticatedPage><ModulesPage /></AuthenticatedPage>} />
      <Route path="/learn/course/:courseId/module/:moduleId" element={<AuthenticatedPage><CoursePage /></AuthenticatedPage>} />
      <Route path="/learn/course/:courseId/module/:moduleId/lesson/:lessonId" element={<AuthenticatedPage><LessonPage /></AuthenticatedPage>} />
      <Route path="/learn/lessons/:lessonId" element={<AuthenticatedPage><LessonPage /></AuthenticatedPage>} />
      <Route path="/quiz" element={<AuthenticatedPage><QuizPage /></AuthenticatedPage>} />
      <Route path="/profile" element={<AuthenticatedPage><ProfilePage /></AuthenticatedPage>} />
      <Route path="/learn/practice" element={<AuthenticatedPage><PracticeMenuPage /></AuthenticatedPage>} />
      <Route path="/learn/practice/:scenarioId" element={<AuthenticatedPage><PracticeScenarioPage /></AuthenticatedPage>} />
      <Route path="/play-bot-6max" element={<AuthenticatedPage><Bot6MaxPage /></AuthenticatedPage>} />
      <Route path="/play-bot-9max" element={<AuthenticatedPage><Bot9MaxPage /></AuthenticatedPage>} />
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
