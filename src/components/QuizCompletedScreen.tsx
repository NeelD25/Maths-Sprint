import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import AdBanner from './AdBanner';

interface QuizCompletedScreenProps {
  results: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalTime: number;
    operation: string;
  } | null;
  onHome: () => void;
  onResults: () => void;
  onBack?: () => void; // Add back navigation prop
}

export default function QuizCompletedScreen({ results, onHome, onResults, onBack }: QuizCompletedScreenProps) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading Results...</p>
        </div>
      </div>
    );
  }

  // Ensure correct calculations - score and correctAnswers should be the same
  const correctCount = results.correctAnswers;
  const totalCount = results.totalQuestions;
  const wrongCount = totalCount - correctCount; // Calculate wrong answers correctly
  
  const percentage = Math.round((correctCount / totalCount) * 100);
  const accuracy = percentage; // Same as percentage since they should be identical

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: 'Outstanding! 🏆', color: 'text-yellow-400' };
    if (percentage >= 80) return { message: 'Excellent! 🌟', color: 'text-green-400' };
    if (percentage >= 70) return { message: 'Great Job! 👏', color: 'text-green-400' };
    if (percentage >= 60) return { message: 'Good Work! 👍', color: 'text-blue-400' };
    if (percentage >= 50) return { message: 'Keep Practicing! 📚', color: 'text-yellow-400' };
    return { message: 'More Practice Needed! 💪', color: 'text-red-400' };
  };

  const performance = getPerformanceMessage();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  // Save results to localStorage for Results screen
  useEffect(() => {
    const today = new Date().toDateString();
    const existingData = localStorage.getItem('mathsSprintResults');
    const allResults = existingData ? JSON.parse(existingData) : [];
    
    const newResult = {
      ...results,
      date: today,
      timestamp: Date.now()
    };
    
    allResults.push(newResult);
    localStorage.setItem('mathsSprintResults', JSON.stringify(allResults));
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button in Top Left */}
        {onBack && (
          <motion.button
            onClick={onBack}
            className="fixed top-6 left-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Quiz Completed!
          </motion.h1>
          <motion.p 
            className="text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {results.operation.charAt(0).toUpperCase() + results.operation.slice(1)} • {results.totalQuestions} Questions
          </motion.p>
        </div>

        {/* Performance Message */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={`text-2xl font-bold ${performance.color}`}>
            {performance.message}
          </h2>
        </motion.div>

        {/* Circle Progress */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                animate={{ strokeDashoffset: showStats ? strokeDashoffset : circumference }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                className="text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {correctCount}/{totalCount}
              </motion.div>
              <motion.div 
                className="text-lg text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {percentage}%
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 20 }}
          transition={{ delay: 1.5 }}
        >
          <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {results.correctAnswers}
            </div>
            <div className="text-sm text-green-300">Correct Answers</div>
          </div>

          <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {wrongCount}
            </div>
            <div className="text-sm text-red-300">Wrong Answers</div>
          </div>

          <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {accuracy}%
            </div>
            <div className="text-sm text-blue-300">Accuracy</div>
          </div>

          <div className="bg-purple-600/20 border border-purple-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {formatTime(results.totalTime)}
            </div>
            <div className="text-sm text-purple-300">Total Time</div>
          </div>
        </motion.div>

        {/* Enhanced Ad Banner */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <AdBanner />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <button
            onClick={onResults}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-4 font-semibold text-lg transition-all"
          >
            View Detailed Results
          </button>

          <button
            onClick={onHome}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-4 font-semibold text-lg transition-all"
          >
            Practice More
          </button>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div 
          className="text-center mt-8 p-6 bg-white/5 border border-white/10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <p className="text-slate-300 italic">
            "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."
          </p>
          <p className="text-slate-500 text-sm mt-2">- William Paul Thurston</p>
        </motion.div>
      </div>
    </div>
  );
}