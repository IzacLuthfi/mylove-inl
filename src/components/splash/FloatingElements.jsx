import React from 'react';
import { FiHeart } from 'react-icons/fi';

export default function FloatingElements({ fadeOut }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <FiHeart className="absolute top-[25%] left-[20%] text-[#D85482]/20 animate-bounce" size={24} />
      <FiHeart className="absolute top-[15%] right-[25%] text-[#2A4480]/10 animate-pulse" size={36} style={{ animationDuration: '3s' }} />
      <FiHeart className="absolute bottom-[30%] left-[15%] text-[#D85482]/30 animate-pulse" size={48} style={{ animationDuration: '4s' }} />
      <FiHeart className="absolute bottom-[20%] right-[20%] text-[#2A4480]/20 animate-bounce" size={20} style={{ animationDelay: '1s' }} />
    </div>
  );
}