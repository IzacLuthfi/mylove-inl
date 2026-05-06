import React from 'react';

export default function BackgroundPattern({ fadeOut }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-[#D85482]/10 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-[#2A4480]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-[10%] left-[20%] w-[70vw] h-[70vw] bg-[#D85482]/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}