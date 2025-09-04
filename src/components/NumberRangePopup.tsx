import React, { useState } from 'react';
import { motion } from 'motion/react';

interface NumberRangePopupProps {
  operation: string;
  onStartQuiz: (min: number, max: number, questionCount: number) => void;
  onClose: () => void;
}

export default function NumberRangePopup({ operation, onStartQuiz, onClose }: NumberRangePopupProps) {
  const getDefaultRanges = () => {
    // All operations now use the same range: 1 to 9999
    return { minVal: 1, maxVal: 9999, defaultMin: 1, defaultMax: 100 };
  };

  const ranges = getDefaultRanges();
  const [min, setMin] = useState(ranges.defaultMin);
  const [max, setMax] = useState(ranges.defaultMax);
  const [questionCount, setQuestionCount] = useState(10);

  // Fixed input handlers to allow clearing and proper editing
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      // Allow temporary empty state, will use minVal when submitting
      setMin('' as any);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setMin(Math.max(ranges.minVal, Math.min(ranges.maxVal, numValue)));
      }
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      // Allow temporary empty state, will use maxVal when submitting
      setMax('' as any);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setMax(Math.max(ranges.minVal, Math.min(ranges.maxVal, numValue)));
      }
    }
  };

  const handleStart = () => {
    // For trigonometry, min and max don't matter as it uses predefined questions
    if (operation.toLowerCase() === 'trigonometry') {
      onStartQuiz(1, 1, questionCount); // Dummy values for trigonometry
      return;
    }

    // Convert empty strings to default values before validation
    const finalMin = min === '' ? ranges.minVal : min;
    const finalMax = max === '' ? ranges.maxVal : max;
    
    if (finalMin >= finalMax) {
      alert('Minimum value must be less than maximum value');
      return;
    }
    onStartQuiz(finalMin, finalMax, questionCount);
  };

  const getOperationName = () => {
    return operation.charAt(0).toUpperCase() + operation.slice(1);
  };

  const isTrigonometry = operation.toLowerCase() === 'trigonometry';

  return (
    <motion.div 
      className="bg-slate-800 border border-white/20 rounded-2xl p-6 w-full max-w-md min-w-[360px] h-[580px] flex flex-col"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {getOperationName()} Practice
        </motion.h2>
        <motion.button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      {/* Settings Section - Consistent height for all operations */}
      <motion.div 
        className="mb-6 h-[140px] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {!isTrigonometry ? (
          <>
            <label className="block text-sm font-semibold mb-3">Number Range (1 - 9999)</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Minimum</label>
                <input
                  type="number"
                  value={min}
                  onChange={handleMinChange}
                  min={ranges.minVal}
                  max={ranges.maxVal}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Maximum</label>
                <input
                  type="number"
                  value={max}
                  onChange={handleMaxChange}
                  min={ranges.minVal}
                  max={ranges.maxVal}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1">
              {operation.toLowerCase() === 'squares' && (
                <p className="text-xs text-slate-400">Range determines the base numbers (e.g., 1-15 means 1² to 15²)</p>
              )}
              {operation.toLowerCase() === 'cubes' && (
                <p className="text-xs text-slate-400">Range determines the base numbers (e.g., 1-10 means 1³ to 10³)</p>
              )}
            </div>
          </>
        ) : (
          <>
            <label className="block text-sm font-semibold mb-3">Trigonometry Practice</label>
            <div className="flex-1 flex items-center">
              <div className="w-full p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300 text-center">
                  Test your knowledge of trigonometric values like sin 30°, cos 45°, tan 60°, etc.
                </p>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Question Count */}
      <motion.div 
        className="mb-6 h-[120px] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <label className="block text-sm font-semibold mb-3">Number of Questions</label>
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[10, 15, 20, 25].map((count) => (
              <motion.button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-2 rounded-lg font-semibold transition-all text-sm ${
                  questionCount === count
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {count}
              </motion.button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[30, 40, 50].map((count) => (
              <motion.button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-2 rounded-lg font-semibold transition-all text-sm ${
                  questionCount === count
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {count}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Presets - Consistent for all operations */}
      <motion.div 
        className="mb-6 h-[140px] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <label className="block text-sm font-semibold mb-3">
          {isTrigonometry ? 'Quick Start Options' : 'Quick Presets'}
        </label>
        <div className="space-y-2 flex-1">
          {!isTrigonometry ? (
            <>
              <motion.button
                onClick={() => {
                  setMin(1);
                  setMax(operation.toLowerCase() === 'squares' ? 10 : operation.toLowerCase() === 'cubes' ? 5 : 50);
                  setQuestionCount(10);
                }}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg py-2 text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🟢 Easy Level
              </motion.button>
              <motion.button
                onClick={() => {
                  setMin(1);
                  setMax(operation.toLowerCase() === 'squares' ? 20 : operation.toLowerCase() === 'cubes' ? 10 : 100);
                  setQuestionCount(15);
                }}
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg py-2 text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🟡 Medium Level
              </motion.button>
              <motion.button
                onClick={() => {
                  setMin(1);
                  setMax(operation.toLowerCase() === 'squares' ? 30 : operation.toLowerCase() === 'cubes' ? 15 : 500);
                  setQuestionCount(20);
                }}
                className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg py-2 text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔴 Hard Level
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => setQuestionCount(10)}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg py-2 text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🟢 Quick Practice (10 Questions)
              </motion.button>
              <motion.button
                onClick={() => setQuestionCount(20)}
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg py-2 text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🟡 Standard Practice (20 Questions)
              </motion.button>
              <motion.button
                onClick={() => setQuestionCount(30)}
                className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg py-2 text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔴 Extended Practice (30 Questions)
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.button
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-4 font-semibold text-lg transition-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Start {getOperationName()} Test
      </motion.button>
    </motion.div>
  );
}