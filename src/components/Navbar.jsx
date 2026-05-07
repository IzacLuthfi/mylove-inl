import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiImage, FiVideo, FiMessageSquare, FiCalendar, FiMusic } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-gray-200 px-2 py-3 flex justify-around items-center z-50 pb-[calc(env(safe-area-inset-bottom)+8px)]">
      
      {/* Home */}
      <Link to="/" className="flex flex-col items-center gap-1 transition-transform active:scale-95 flex-1">
        <div className="relative">
          <FiHome size={22} className={location.pathname === '/' ? 'text-[#2A3A6A]' : 'text-gray-400'} />
          {location.pathname === '/' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D85482] rounded-full border border-[#FAFAFA]"></div>}
        </div>
        <span className={`text-[9px] font-bold ${location.pathname === '/' ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Home</span>
      </Link>

      {/* Gallery */}
      <Link to="/gallery" className="flex flex-col items-center gap-1 transition-transform active:scale-95 flex-1">
        <div className="relative">
          <FiImage size={22} className={isActive('/gallery') ? 'text-[#2A3A6A]' : 'text-gray-400'} />
          {isActive('/gallery') && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D85482] rounded-full border border-[#FAFAFA]"></div>}
        </div>
        <span className={`text-[9px] font-bold ${isActive('/gallery') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Gallery</span>
      </Link>

      {/* Video */}
      <Link to="/video" className="flex flex-col items-center gap-1 transition-transform active:scale-95 flex-1">
        <div className="relative">
          <FiVideo size={22} className={isActive('/video') ? 'text-[#2A3A6A]' : 'text-gray-400'} />
          {isActive('/video') && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D85482] rounded-full border border-[#FAFAFA]"></div>}
        </div>
        <span className={`text-[9px] font-bold ${isActive('/video') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Video</span>
      </Link>

      {/* Music (BARU) */}
      <Link to="/music" className="flex flex-col items-center gap-1 transition-transform active:scale-95 flex-1">
        <div className="relative">
          <FiMusic size={22} className={isActive('/music') ? 'text-[#D85482]' : 'text-gray-400'} />
          {isActive('/music') && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#2A4480] rounded-full border border-[#FAFAFA]"></div>}
        </div>
        <span className={`text-[9px] font-bold ${isActive('/music') ? 'text-[#D85482]' : 'text-gray-400'}`}>Music</span>
      </Link>

      {/* Notes */}
      <Link to="/notes" className="flex flex-col items-center gap-1 transition-transform active:scale-95 flex-1">
        <div className="relative">
          <FiMessageSquare size={22} className={isActive('/notes') ? 'text-[#2A3A6A]' : 'text-gray-400'} />
          {isActive('/notes') && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D85482] rounded-full border border-[#FAFAFA]"></div>}
        </div>
        <span className={`text-[9px] font-bold ${isActive('/notes') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Notes</span>
      </Link>

      {/* Planner */}
      <Link to="/planner" className="flex flex-col items-center gap-1 transition-transform active:scale-95 flex-1">
        <div className="relative">
          <FiCalendar size={22} className={isActive('/planner') ? 'text-[#2A3A6A]' : 'text-gray-400'} />
          {isActive('/planner') && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D85482] rounded-full border border-[#FAFAFA]"></div>}
        </div>
        <span className={`text-[9px] font-bold ${isActive('/planner') ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>Planner</span>
      </Link>

    </div>
  );
};

export default Navbar;