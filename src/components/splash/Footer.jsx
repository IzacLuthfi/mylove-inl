import React from 'react';

export default function Footer({ fadeIn, fadeOut }) {
  return (
    <div className={`absolute bottom-8 transition-all duration-1000 delay-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${fadeOut ? 'opacity-0' : ''}`}>
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1.5">
        Made with <span className="text-[#D85482] animate-ping">❤</span> for Us
      </p>
    </div>
  );
}