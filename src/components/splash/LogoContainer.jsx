import React from 'react';
// Pastikan path ke Logo.png sudah benar
import LogoImg from '../../assets/Logo.png'; 

export default function LogoContainer() {
  return (
    <div className="relative mb-6 group">
      {/* Efek Glow di belakang Logo */}
      <div className="absolute inset-0 bg-[#D85482] rounded-full blur-2xl opacity-30 animate-pulse"></div>
      
      {/* Logo Utama */}
      <img 
        src={LogoImg} 
        alt="Logo MyLove I&L" 
        className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-[3px] border-white shadow-2xl relative z-10" 
      />
    </div>
  );
}