import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import QuizCompletedScreen from './components/QuizCompletedScreen';
import ResultsScreen from './components/ResultsScreen';
import ProfileScreen from './components/ProfileScreen';

type Screen = 'home' | 'quiz' | 'quiz-completed' | 'results' | 'profile';

interface QuizParams {
  operation: string;
  min: number;
  max: number;
  questionCount: number;
}

interface QuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalTime: number;
  operation: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['home']);
  const [quizParams, setQuizParams] = useState<QuizParams | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [networkAvailable, setNetworkAvailable] = useState(true);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      
      // Always navigate back to previous screen, never exit
      if (screenHistory.length > 1) {
        navigateBack();
      } else {
        // If no history, go to home
        setCurrentScreen('home');
        setScreenHistory(['home']);
      }
    };

    // Add a history state when the app loads
    window.history.replaceState({ screen: currentScreen }, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentScreen, screenHistory]);

  // Update history state when screen changes (but not for main navigation screens)
  useEffect(() => {
    // Only push to browser history for non-main screens
    if (!['home', 'results', 'profile'].includes(currentScreen)) {
      window.history.pushState({ screen: currentScreen }, '', window.location.href);
    } else {
      // For main screens, replace the current history state
      window.history.replaceState({ screen: currentScreen }, '', window.location.href);
    }
  }, [currentScreen]);

  // Check network connectivity on app start
  useEffect(() => {
    const checkNetwork = () => {
      if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
        setNetworkAvailable(navigator.onLine);
      }
    };

    checkNetwork();
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  const navigateToQuiz = (params: QuizParams) => {
    setQuizParams(params);
    updateScreenHistory('quiz');
  };

  const navigateToQuizCompleted = (results: QuizResults) => {
    setQuizResults(results);
    updateScreenHistory('quiz-completed');
  };

  const navigateToScreen = (screen: Screen) => {
    // For main navigation screens (home, results, profile), don't add to history stack
    if (['home', 'results', 'profile'].includes(screen)) {
      setCurrentScreen(screen);
      // Keep the history clean for main navigation
      setScreenHistory([screen]);
    } else {
      updateScreenHistory(screen);
    }
  };

  const updateScreenHistory = (screen: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    setScreenHistory(prev => {
      if (prev.length <= 1) {
        // If no history, go to home
        setCurrentScreen('home');
        return ['home'];
      }
      
      const newHistory = prev.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      return newHistory;
    });
  };

  const renderScreen = () => {
    // Lighter animations
    const screenVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };

    const transition = {
      duration: 0.1,
      ease: "easeOut"
    };

    switch (currentScreen) {
      case 'home':
        return (
          <motion.div
            key="home"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <HomeScreen onNavigateToQuiz={navigateToQuiz} />
          </motion.div>
        );
      case 'quiz':
        return quizParams ? (
          <motion.div
            key="quiz"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <QuizScreen 
              {...quizParams} 
              onComplete={navigateToQuizCompleted}
              onBack={navigateBack}
            />
          </motion.div>
        ) : null;
      case 'quiz-completed':
        return (
          <motion.div
            key="quiz-completed"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <QuizCompletedScreen 
              results={quizResults} 
              onHome={() => navigateToScreen('home')}
              onResults={() => navigateToScreen('results')}
              onBack={navigateBack}
            />
          </motion.div>
        );
      case 'results':
        return (
          <motion.div
            key="results"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <ResultsScreen onBack={navigateBack} />
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div
            key="profile"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <ProfileScreen onBack={navigateBack} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="home"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <HomeScreen onNavigateToQuiz={navigateToQuiz} />
          </motion.div>
        );
    }
  };

  // Network warning popup
  if (!networkAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <motion.div 
          className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center max-w-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3">No Internet Connection</h2>
          <p className="text-slate-300 mb-6">Please turn on mobile data or Wi-Fi to use Maths Sprint.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Show bottom navigation on main screens
  const showBottomNav = ['home', 'results', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Content */}
      <div className={`min-h-screen ${showBottomNav ? 'pb-16' : ''}`}>
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - Show on Home, Results, and Profile */}
      {showBottomNav && (
        <motion.nav 
          className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 px-4 py-2 h-16 z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex justify-around items-center h-full max-w-md mx-auto">
            <button
              onClick={() => navigateToScreen('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentScreen === 'home' ? 'text-white' : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => navigateToScreen('results')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentScreen === 'results' ? 'text-white' : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span className="text-xs">Results</span>
            </button>

            <button
              onClick={() => navigateToScreen('profile')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentScreen === 'profile' ? 'text-white' : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </motion.nav>
      )}
    </div>
  );
}