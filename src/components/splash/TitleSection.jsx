import React from 'react';

export default function TitleSection({ fadeIn }) {
  return (
    <div className={`text-center mb-10 transition-all duration-1000 delay-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h1 className="text-3xl sm:text-4xl font-black text-[#2A3A6A] tracking-wide mb-1">MyLove I&L</h1>
      <p className="text-xs sm:text-sm font-bold text-[#D85482] tracking-[0.2em] uppercase">Kenangan Abadi Kita</p>
    </div>
  );
}