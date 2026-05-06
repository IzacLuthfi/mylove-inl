import React from 'react';

export default function LoadingAnimation({ fadeIn, progress }) {
  return (
    <div className={`w-full max-w-[200px] transition-all duration-1000 delay-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-3 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-[#2A4480] to-[#D85482] rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-center text-[10px] font-bold text-[#2A4480]/60 uppercase tracking-widest animate-pulse">
        Menyiapkan Kenangan... {progress}%
      </div>
    </div>
  );
}