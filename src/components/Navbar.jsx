import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiImage, FiPlus, FiMessageSquare, FiCalendar } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  
  // Fungsi untuk mengecek halaman aktif mengembalikan boolean
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 pb-[env(safe-area-inset-bottom)]">
      
      {/* Menu Home */}
      <Link to="/" className="flex flex-col items-center gap-1 transition-transform active:scale-95 w-12">
        <div className="relative">
          <FiHome size={26} className={isActive('/') ? 'text-[#2A3A6A] fill-[#2A3A6A]/10' : 'text-gray-400'} />
          {isActive('/') && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D85482] rounded-full border-2 border-[#FAFAFA]"></div>
          )}
        </div>
        <span className={`text-[10px] font-bold ${isActive('/') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Home</span>
      </Link>

      {/* Menu Gallery */}
      <Link to="/gallery" className="flex flex-col items-center gap-1 transition-transform active:scale-95 w-12">
        <div className="relative">
          <FiImage size={26} className={isActive('/gallery') ? 'text-[#2A3A6A] fill-[#2A3A6A]/10' : 'text-gray-400'} />
          {isActive('/gallery') && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D85482] rounded-full border-2 border-[#FAFAFA]"></div>
          )}
        </div>
        <span className={`text-[10px] font-bold ${isActive('/gallery') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Gallery</span>
      </Link>
      
      {/* Tombol Plus Mengambang (Floating Action Button) */}
      <div className="relative -top-6">
        <button className="bg-[#D85482] text-white p-3.5 rounded-full shadow-[0_8px_16px_rgba(216,84,130,0.3)] transform transition hover:scale-105 active:scale-95 border-4 border-[#FAFAFA] flex items-center justify-center">
          <FiPlus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Menu Notes */}
      <Link to="/notes" className="flex flex-col items-center gap-1 transition-transform active:scale-95 w-12">
        <div className="relative">
          <FiMessageSquare size={26} className={isActive('/notes') ? 'text-[#2A3A6A] fill-[#2A3A6A]/10' : 'text-gray-400'} />
          {isActive('/notes') && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D85482] rounded-full border-2 border-[#FAFAFA]"></div>
          )}
        </div>
        <span className={`text-[10px] font-bold ${isActive('/notes') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Notes</span>
      </Link>

      {/* Menu Planner */}
      <Link to="/planner" className="flex flex-col items-center gap-1 transition-transform active:scale-95 w-12">
        <div className="relative">
          <FiCalendar size={26} className={isActive('/planner') ? 'text-[#2A3A6A] fill-[#2A3A6A]/10' : 'text-gray-400'} />
          {isActive('/planner') && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D85482] rounded-full border-2 border-[#FAFAFA]"></div>
          )}
        </div>
        <span className={`text-[10px] font-bold ${isActive('/planner') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Planner</span>
      </Link>

    </div>
  );
};

export default Navbar;