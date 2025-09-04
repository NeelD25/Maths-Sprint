import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import AdBanner from './AdBanner';

interface ResultsScreenProps {
  onBack: () => void;
}

interface TestResult {
  operation: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalTime: number;
  date: string;
  timestamp: number;
}

interface OperationStats {
  operation: string;
  icon: string;
  totalAttempts: number;
  accuracy: number;
  averageTime: number;
  color: string;
  rank: 'strongest' | 'medium' | 'weakest';
}

export default function ResultsScreen({ onBack }: ResultsScreenProps) {
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [todayResults, setTodayResults] = useState<TestResult[]>([]);
  const [operationStats, setOperationStats] = useState<OperationStats[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const stored = localStorage.getItem('mathsSprintResults');
    const results: TestResult[] = stored ? JSON.parse(stored) : [];
    
    const today = new Date().toDateString();
    const todaysTests = results.filter(result => result.date === today);
    
    setAllResults(results);
    setTodayResults(todaysTests);
    calculateOperationStats(results);
  };

  const calculateOperationStats = (results: TestResult[]) => {
    const operations = ['addition', 'subtraction', 'multiplication', 'division', 'squares', 'cubes', 'trigonometry'];
    const icons = ['+', '−', '×', '÷', 'x²', 'x³', 'θ'];
    
    const stats = operations.map((op, index) => {
      const opResults = results.filter(r => 
        r.operation.toLowerCase() === op
      );
      
      if (opResults.length === 0) {
        return {
          operation: op.charAt(0).toUpperCase() + op.slice(1),
          icon: icons[index],
          totalAttempts: 0,
          accuracy: 0,
          averageTime: 0,
          color: 'bg-gray-600',
          rank: 'weakest' as const
        };
      }
      
      const totalQuestions = opResults.reduce((sum, r) => sum + r.totalQuestions, 0);
      const totalCorrect = opResults.reduce((sum, r) => sum + r.correctAnswers, 0);
      const totalTime = opResults.reduce((sum, r) => sum + r.totalTime, 0);
      
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const averageTime = opResults.length > 0 ? Math.round(totalTime / opResults.length) : 0;
      
      return {
        operation: op.charAt(0).toUpperCase() + op.slice(1),
        icon: icons[index],
        totalAttempts: totalQuestions,
        accuracy,
        averageTime,
        color: '',
        rank: 'medium' as const
      };
    });
    
    // Sort by accuracy to determine ranks
    const sortedStats = [...stats].sort((a, b) => b.accuracy - a.accuracy);
    
    // Assign colors based on rank (for 7 operations)
    sortedStats.forEach((stat, index) => {
      const originalIndex = stats.findIndex(s => s.operation === stat.operation);
      // Only assign ranks to operations that have been attempted
      if (stat.totalAttempts > 0) {
        if (index < 2) {
          stats[originalIndex].color = 'bg-green-600';
          stats[originalIndex].rank = 'strongest';
        } else if (index < 5) {
          stats[originalIndex].color = 'bg-yellow-600';
          stats[originalIndex].rank = 'medium';
        } else {
          stats[originalIndex].color = 'bg-red-600';
          stats[originalIndex].rank = 'weakest';
        }
      } else {
        // No attempts - keep as gray
        stats[originalIndex].color = 'bg-gray-600';
        stats[originalIndex].rank = 'weakest';
      }
    });
    
    setOperationStats(stats);
  };

  const getTodaySummary = () => {
    if (todayResults.length === 0) {
      return {
        totalAttempted: 0,
        accuracy: 0,
        averageTime: 0
      };
    }
    
    const totalQuestions = todayResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = todayResults.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalTime = todayResults.reduce((sum, r) => sum + r.totalTime, 0);
    
    return {
      totalAttempted: totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      averageTime: todayResults.length > 0 ? Math.round(totalTime / todayResults.length) : 0
    };
  };

  const summary = getTodaySummary();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-11"></div>
          <h1 className="text-xl font-bold">Maths Sprint Results</h1>
          <div className="w-11"></div>
        </motion.div>

        {/* Today Summary */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Today Summary</h2>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {summary.totalAttempted}
                </div>
                <div className="text-sm text-slate-400">Questions Attempted</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {summary.accuracy}%
                </div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {formatTime(summary.averageTime)}
                </div>
                <div className="text-sm text-slate-400">Avg Time</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Ad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AdBanner variant="video" />
        </motion.div>

        {/* Analysis Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
          <div className="space-y-4">
            {operationStats.map((stat, index) => (
              <motion.div 
                key={stat.operation}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">{stat.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{stat.operation}</div>
                      <div className="text-xs text-slate-400">
                        {stat.totalAttempts} questions attempted
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      stat.rank === 'strongest' ? 'text-green-400' :
                      stat.rank === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {stat.rank === 'strongest' ? '💪 Strongest' :
                       stat.rank === 'medium' ? '⚡ Medium' : '📚 Practice More'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {stat.accuracy}% accuracy
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: stat.totalAttempts === 0 ? "0%" : `${Math.min((stat.totalAttempts / 50) * 100, 100)}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <div className="absolute right-0 -top-1 text-xs text-slate-400">
                    {stat.totalAttempts} total
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Tests */}
        {todayResults.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Today's Tests</h2>
            <div className="space-y-3">
              {todayResults.slice(-5).reverse().map((result, index) => {
                const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
                return (
                  <motion.div 
                    key={result.timestamp}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {result.operation.charAt(0).toUpperCase() + result.operation.slice(1)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          accuracy >= 80 ? 'text-green-400' :
                          accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {accuracy}%
                        </div>
                        <div className="text-sm text-slate-400">
                          {formatTime(result.totalTime)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Motivational Message */}
        <motion.div 
          className="text-center p-6 bg-white/5 border border-white/10 rounded-xl mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <p className="text-slate-300">
            {summary.totalAttempted === 0 
              ? "Start practicing today to see your progress!" 
              : `Great job! You've attempted ${summary.totalAttempted} questions today!`
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}