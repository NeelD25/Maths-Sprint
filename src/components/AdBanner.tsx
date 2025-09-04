import React from 'react';

interface AdBannerProps {
  variant?: 'quiz' | 'home' | 'video';
}

export default function AdBanner({ variant = 'home' }: AdBannerProps) {
  if (variant === 'quiz') {
    // Thin banner for quiz screen to save space
    return (
      <div className="mx-auto p-2 bg-white/5 border border-white/10 rounded-lg text-center">
        <div className="text-xs text-slate-400 mb-1">Advertisement</div>
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 h-16 w-full rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="text-center relative z-10">
            <span className="text-slate-400 text-xs block">Banner Ad Space</span>
            <span className="text-slate-500 text-xs">320x50 (Mobile Banner)</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'video') {
    // Video ad space for results and profile screens
    return (
      <div className="mx-auto my-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
        <div className="text-xs text-slate-400 mb-3">Advertisement</div>
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-64 w-full max-w-sm mx-auto rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="text-center relative z-10">
            <span className="text-slate-400 text-sm block mb-2">Video Ad Space</span>
            <span className="text-slate-500 text-xs">300x250 (Medium Rectangle)</span>
            <div className="mt-3 text-slate-500 text-xs">
              Suitable for video advertisements
            </div>
          </div>
          
          {/* Video play icon */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Default home screen layout - larger banner only (no video ads)
  return (
    <div className="mx-auto my-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
      <div className="text-xs text-slate-400 mb-3">Advertisement</div>
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 h-32 w-full rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="text-center relative z-10">
          <span className="text-slate-400 text-sm block mb-1">Banner Ad Space</span>
          <span className="text-slate-500 text-xs">320x100 (Large Mobile Banner)</span>
        </div>
      </div>
    </div>
  );
}