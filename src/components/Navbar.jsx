import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiImage, FiPlus, FiMessageSquare, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  
  // Fungsi untuk mengecek halaman mana yang sedang aktif
  const isActive = (path) => location.pathname === path ? "text-blue-500" : "text-gray-500 hover:text-white";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-md border-t border-gray-800 px-6 py-3 flex justify-between items-center rounded-t-[2rem] z-50">
      <Link to="/" className={`flex flex-col items-center transition ${isActive('/')}`}>
        <FiHome className="text-2xl mb-1" />
      </Link>
      <Link to="/gallery" className={`flex flex-col items-center transition ${isActive('/gallery')}`}>
        <FiImage className="text-2xl mb-1" />
      </Link>
      
      {/* Tombol Plus Mengambang */}
      <div className="relative -top-6">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/40 transform transition hover:scale-105 border-4 border-[#0F172A]">
          <FiPlus className="text-2xl" />
        </button>
      </div>

      <Link to="/notes" className={`flex flex-col items-center transition ${isActive('/notes')}`}>
        <FiMessageSquare className="text-2xl mb-1" />
      </Link>
      <Link to="/planner" className={`flex flex-col items-center transition ${isActive('/planner')}`}>
        <FiUser className="text-2xl mb-1" />
      </Link>
    </div>
  );
};

export default Navbar;