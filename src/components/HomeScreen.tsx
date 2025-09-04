import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import NumberRangePopup from './NumberRangePopup';
import AdBanner from './AdBanner';

interface HomeScreenProps {
  onNavigateToQuiz: (params: { operation: string; min: number; max: number; questionCount: number }) => void;
}

export default function HomeScreen({ onNavigateToQuiz }: HomeScreenProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState('');

  const operationButtons = [
    { 
      id: 'addition', 
      label: 'Addition', 
      icon: '+', 
      color: 'from-emerald-600 to-emerald-700',
      description: 'Practice adding numbers'
    },
    { 
      id: 'subtraction', 
      label: 'Subtraction', 
      icon: '−', 
      color: 'from-orange-600 to-orange-700',
      description: 'Practice subtracting numbers'
    },
    { 
      id: 'multiplication', 
      label: 'Multiplication', 
      icon: '×', 
      color: 'from-purple-600 to-purple-700',
      description: 'Practice multiplying numbers'
    },
    { 
      id: 'division', 
      label: 'Division', 
      icon: '÷', 
      color: 'from-rose-600 to-rose-700',
      description: 'Practice dividing numbers'
    },
    { 
      id: 'squares', 
      label: 'Squares', 
      icon: 'x²', 
      color: 'from-cyan-600 to-cyan-700',
      description: 'Practice perfect squares'
    },
    { 
      id: 'cubes', 
      label: 'Cubes', 
      icon: 'x³', 
      color: 'from-indigo-600 to-indigo-700',
      description: 'Practice perfect cubes'
    },
    { 
      id: 'trigonometry', 
      label: 'Trigonometry', 
      icon: 'θ', 
      color: 'from-teal-600 to-teal-700',
      description: 'Practice trigonometric values'
    },
  ];

  const handleOperationSelect = (operation: string) => {
    setSelectedOperation(operation);
    setShowPopup(true);
  };

  const handleQuizStart = (min: number, max: number, questionCount: number) => {
    onNavigateToQuiz({
      operation: selectedOperation,
      min,
      max,
      questionCount
    });
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            Maths Sprint
          </motion.h1>
          <p className="text-slate-400 text-lg">Quick calculation practice for competitive exams</p>
        </motion.div>

        {/* Top Video Ad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
          <AdBanner variant="video" />
        </motion.div>

        {/* Operation Categories */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Practice by Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {operationButtons.map((operation, index) => (
              <motion.button
                key={operation.id}
                onClick={() => handleOperationSelect(operation.id)}
                className={`bg-gradient-to-br ${operation.color} rounded-xl p-5 text-left relative overflow-hidden ${
                  operation.id === 'trigonometry' ? 'col-span-2' : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative">
                  <div className="text-3xl font-bold mb-2">{operation.icon}</div>
                  <div className="text-base font-semibold mb-1">{operation.label}</div>
                  <div className="text-sm text-white/70">{operation.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Timed Practice</h3>
            <p className="text-sm text-slate-400">Track your speed and accuracy</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Progress Tracking</h3>
            <p className="text-sm text-slate-400">Monitor your improvement</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Exam Ready</h3>
            <p className="text-sm text-slate-400">Perfect for competitive exams</p>
          </div>
        </motion.div>
      </div>

      {/* Popup with Animation */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <NumberRangePopup
                operation={selectedOperation}
                onStartQuiz={handleQuizStart}
                onClose={() => setShowPopup(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}