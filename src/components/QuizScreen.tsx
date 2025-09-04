import React, { useState, useEffect } from 'react';
import { generateQuestion, Question } from '../utils/questionGenerator';
import AdBanner from './AdBanner';

interface QuizScreenProps {
  operation: string;
  min: number;
  max: number;
  questionCount: number;
  onComplete: (results: { 
    score: number; 
    totalQuestions: number; 
    correctAnswers: number;
    wrongAnswers: number;
    totalTime: number;
    operation: string;
  }) => void;
  onBack: () => void;
}

export default function QuizScreen({ operation, min, max, questionCount, onComplete, onBack }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<number | string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    try {
      for (let i = 0; i < questionCount; i++) {
        const question = generateQuestion(operation, min, max);
        newQuestions.push(question);
      }
      setQuestions(newQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback: redirect back to home if question generation fails
      alert(`Error generating ${operation} questions. Please try again.`);
      onBack();
    }
  };

  const handleAnswerSelect = (answer: number | string) => {
    if (submittedAnswer !== null) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || submittedAnswer !== null) return;
    
    setSubmittedAnswer(selectedAnswer);
    
    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 1); // Keep score in sync with correct answers
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    // Move to next question after showing feedback
    setTimeout(() => {
      moveToNextQuestion();
    }, 800);
  };

  const moveToNextQuestion = () => {
    if (currentQuestion + 1 < questionCount) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSubmittedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Ensure wrong answers is calculated correctly
    const finalWrongAnswers = questionCount - correctAnswers;
    
    onComplete({ 
      score: correctAnswers, // Score should equal correct answers
      totalQuestions: questionCount,
      correctAnswers,
      wrongAnswers: finalWrongAnswers,
      totalTime: elapsedTime,
      operation
    });
  };

  const handleQuitClick = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    onBack();
  };

  const cancelQuit = () => {
    setShowQuitConfirm(false);
  };

  const getAnswerButtonClass = (answer: number | string) => {
    if (submittedAnswer === null) {
      if (selectedAnswer === answer) {
        return 'bg-blue-600/30 border-blue-500 text-blue-300';
      }
      return 'bg-white/5 border-white/10 hover:bg-white/10';
    }
    
    if (answer === questions[currentQuestion].answer) {
      return 'bg-green-600/20 border-green-600 text-green-300';
    } else if (answer === submittedAnswer) {
      return 'bg-red-600/20 border-red-600 text-red-300';
    } else {
      return 'bg-white/5 border-white/10 opacity-50';
    }
  };

  // Enhanced function to render mathematical notation properly
  const renderMathText = (text: string | number) => {
    const textStr = text.toString();
    
    // Handle undefined values
    if (textStr === 'undefined') {
      return <span className="text-lg font-medium text-orange-400">undefined</span>;
    }
    
    // Handle fractions - split by / and render as fraction
    if (textStr.includes('/')) {
      const parts = textStr.split('/');
      if (parts.length === 2) {
        return (
          <div className="inline-flex flex-col items-center justify-center leading-none">
            <div className="text-lg px-1">{renderMathContent(parts[0])}</div>
            <hr className="w-full border-current my-1 border-t-2" />
            <div className="text-lg px-1">{renderMathContent(parts[1])}</div>
          </div>
        );
      }
    }
    
    return <span>{renderMathContent(textStr)}</span>;
  };

  // Helper function to render mathematical content (square roots, etc.)
  const renderMathContent = (content: string) => {
    // Handle square roots
    if (content.includes('√')) {
      return content.replace(/√(\d+)/g, '√$1');
    }
    return content;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Generating Questions...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questionCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Static container - no scrolling */}
      <div className="h-screen flex flex-col px-4 py-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleQuitClick}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="text-lg font-bold">
              {currentQuestion + 1} / {questionCount}
            </div>
            <div className="text-sm text-slate-400 capitalize">
              {operation}
            </div>
          </div>
          
          <div className="px-4 py-2 rounded-full bg-blue-600 min-w-[80px] text-center">
            <span className="font-bold">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-green-600/20 border border-green-600/30 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-green-400">{correctAnswers}</div>
            <div className="text-xs text-green-300">Correct</div>
          </div>
          <div className="bg-red-600/20 border border-red-600/30 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-red-400">{wrongAnswers}</div>
            <div className="text-xs text-red-300">Wrong</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-4 text-center flex-none">
          <h2 className="text-4xl font-bold">
            {currentQ.question}
          </h2>
        </div>

        {/* Ad Banner - Thin version for quiz */}
        <div className="mb-3 flex-none">
          <AdBanner variant="quiz" />
        </div>

        {/* Options - Scrollable area with fixed height */}
        <div className="flex-1 min-h-0 mb-4">
          <div className="h-full overflow-y-auto space-y-3 pr-2">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={submittedAnswer !== null}
                className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 ${getAnswerButtonClass(option)} min-h-[70px] flex items-center justify-center`}
              >
                <div className="text-2xl font-semibold">
                  {renderMathText(option)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex-none">
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || submittedAnswer !== null}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              selectedAnswer !== null && submittedAnswer === null
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                : submittedAnswer !== null
                ? (submittedAnswer === questions[currentQuestion].answer ? 'bg-green-600 text-white' : 'bg-red-600 text-white')
                : 'bg-white/10 text-slate-400 cursor-not-allowed'
            }`}
          >
            {submittedAnswer !== null 
              ? (submittedAnswer === questions[currentQuestion].answer ? '✓ Correct!' : '✗ Incorrect')
              : (selectedAnswer !== null ? 'Submit Answer' : 'Select an Answer')
            }
          </button>
        </div>
      </div>

      {/* Quit Confirmation Popup */}
      {showQuitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-white/20 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Quit Test?</h3>
            <p className="text-slate-300 text-center mb-6">
              Do you want to quit the test? Your progress will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelQuit}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 font-semibold transition-all"
              >
                No
              </button>
              <button
                onClick={confirmQuit}
                className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl py-3 font-semibold transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}