import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import AdBanner from './AdBanner';

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('mathsSprintUserName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const saveName = (name: string) => {
    setUserName(name);
    localStorage.setItem('mathsSprintUserName', name);
    setIsEditingName(false);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Maths Sprint',
        text: 'Check out Maths Sprint - the best app for quick math practice! Perfect for competitive exams.',
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = encodeURIComponent('Check out Maths Sprint - the best app for quick math practice! Perfect for competitive exams.');
      const whatsappUrl = `https://wa.me/?text=${shareText}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleRateApp = () => {
    // Redirect to Play Store - paste your app's Play Store URL here
    const playStoreUrl = 'PASTE_YOUR_PLAY_STORE_RATING_LINK_HERE';
    
    // For now, show a message since no URL is provided yet
    if (playStoreUrl === 'PASTE_YOUR_PLAY_STORE_RATING_LINK_HERE') {
      alert('Thank you for wanting to rate Maths Sprint! ⭐⭐⭐⭐⭐\n\nPlease replace the placeholder URL in the code to enable Play Store redirection.');
    } else {
      // Redirect to Play Store rating page
      window.open(playStoreUrl, '_blank');
    }
  };

  const handleAboutApp = () => {
    alert(`Maths Sprint v1.0\n\nQuick calculation practice for competitive exams\n\nFeatures:\n• Daily challenges\n• Timed practice\n• Progress tracking\n• Performance analysis\n\nDeveloped for Indian government exam aspirants\n\n© 2025 Maths Sprint`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-11"></div>
          <h1 className="text-xl font-bold">Profile</h1>
          <div className="w-11"></div>
        </motion.div>

        {/* Profile Picture and Name */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Profile Picture */}
          <motion.div 
            className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </motion.div>

          {/* Name Section */}
          {isEditingName ? (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <input
                type="text"
                placeholder="Enter your name"
                defaultValue={userName}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-lg font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    saveName((e.target as HTMLInputElement).value);
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                    saveName(input.value);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-2xl font-bold">
                {userName || 'Tap to set your name'}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {userName ? 'Edit name' : 'Set your name'}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Video Ad Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AdBanner variant="video" />
        </motion.div>

        {/* Menu Options */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Rate App */}
          <motion.button
            onClick={handleRateApp}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg">Rate App</div>
                <div className="text-sm text-slate-400">Help us improve Maths Sprint</div>
              </div>
              <svg className="w-5 h-5 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>

          {/* Share App */}
          <motion.button
            onClick={handleShareApp}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg">Share App</div>
                <div className="text-sm text-slate-400">Share via WhatsApp & more</div>
              </div>
              <svg className="w-5 h-5 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>

          {/* About App */}
          <motion.button
            onClick={handleAboutApp}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg">About App</div>
                <div className="text-sm text-slate-400">Version, features & info</div>
              </div>
              <svg className="w-5 h-5 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        </motion.div>

        {/* App Stats */}
        <motion.div 
          className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-bold text-lg mb-4">Your Stats</h3>
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {JSON.parse(localStorage.getItem('mathsSprintResults') || '[]').length}
              </div>
              <div className="text-sm text-slate-400">Tests Taken</div>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div 
          className="mt-8 text-center text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm">Maths Sprint v1.0</p>
          <p className="text-xs mt-1">Made for competitive exam aspirants</p>
        </motion.div>
      </div>
    </div>
  );
}