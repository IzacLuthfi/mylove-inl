import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiSearch, FiImage, FiVideo, FiCalendar, 
  FiHeart, FiMessageSquare, FiStar, FiChevronRight 
} from 'react-icons/fi';

const Home = () => {
  const [daysTogether, setDaysTogether] = useState(0);

  // Tanggal jadian (Silakan sesuaikan tanggal ini, Izac!)
  const anniversaryDate = new Date("2024-01-01"); 

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const diffTime = Math.abs(today - anniversaryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    };
    calculateDays();
  }, []);

  return (
    <div className="min-h-screen animate-fadeIn">
      
      {/* 1. HEADER SECTION & LOVE COUNTER */}
      <section className="px-6 pt-12 pb-8 bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Dekorasi Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-pink-500/20 rounded-full blur-[60px]"></div>
        <div className="absolute bottom-0 left-[-10%] w-32 h-32 bg-blue-500/20 rounded-full blur-[50px]"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">MyLove I&L</h1>
              <p className="text-gray-400 text-sm mt-1">Halo Izac & Lian!</p>
            </div>
            <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
              <FiHeart className="text-pink-500 text-xl animate-pulse" />
            </div>
          </div>

          {/* Love Counter Card */}
          <div className="bg-gradient-to-r from-blue-600/20 to-pink-600/20 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-1">Sudah Bersama Selama</p>
              <h2 className="text-4xl font-black text-white">{daysTogether} <span className="text-lg font-normal text-gray-300">Hari</span></h2>
            </div>
            <Link to="/planner" className="bg-white text-[#0F172A] p-3 rounded-full shadow-lg hover:scale-110 transition">
              <FiChevronRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SEARCH SECTION */}
      <section className="px-6 -mt-6 relative z-20">
        <div className="bg-[#1E293B] flex items-center px-5 py-4 rounded-2xl shadow-xl border border-white/5">
          <FiSearch className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Cari kenangan manis..." 
            className="bg-transparent w-full focus:outline-none text-sm text-white placeholder-gray-500"
          />
        </div>
      </section>

      {/* 3. HORIZONTAL ALBUMS SECTION */}
      <section className="mt-10 pl-6">
        <div className="flex justify-between items-center pr-6 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Album Unggulan</h3>
          <Link to="/gallery" className="text-xs text-blue-400 font-medium">Lihat Semua</Link>
        </div>
        
        <div className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide">
          {/* Folder Foto */}
          <div className="min-w-[160px] aspect-[4/5] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-xl shadow-blue-900/20">
            <div className="bg-white/20 w-fit p-3 rounded-2xl">
              <FiImage className="text-white text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Galeri<br/>Foto</h4>
              <p className="text-xs text-blue-100 mt-2 opacity-80">1.2k Kenangan</p>
            </div>
          </div>

          {/* Folder Video */}
          <div className="min-w-[160px] aspect-[4/5] bg-[#1E293B] rounded-[2.5rem] p-6 flex flex-col justify-between shadow-xl border border-white/5">
            <div className="bg-purple-500/20 w-fit p-3 rounded-2xl">
              <FiVideo className="text-purple-400 text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Momen<br/>Video</h4>
              <p className="text-xs text-gray-500 mt-2">800 File</p>
            </div>
          </div>

          {/* Folder Favorit */}
          <div className="min-w-[160px] aspect-[4/5] bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-xl shadow-pink-900/20">
            <div className="bg-white/20 w-fit p-3 rounded-2xl">
              <FiStar className="text-white text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Paling<br/>Berkesan</h4>
              <p className="text-xs text-pink-100 mt-2 opacity-80">Pilihan Izac & Lian</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GRID CATEGORIES SECTION */}
      <section className="px-6 mt-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">Menu Utama</h3>
        <div className="grid grid-cols-2 gap-4">
          
          <Link to="/notes" className="bg-[#1E293B] p-5 rounded-[2rem] border border-white/5 flex flex-col gap-3 hover:bg-[#26334A] transition active:scale-95">
            <div className="bg-green-500/10 w-fit p-3 rounded-2xl text-green-400">
              <FiMessageSquare className="text-xl" />
            </div>
            <span className="font-bold text-sm">Catatan Hati</span>
            <span className="text-[10px] text-gray-500 -mt-2">123 Pesan Tersimpan</span>
          </Link>

          <Link to="/planner" className="bg-[#1E293B] p-5 rounded-[2rem] border border-white/5 flex flex-col gap-3 hover:bg-[#26334A] transition active:scale-95">
            <div className="bg-orange-500/10 w-fit p-3 rounded-2xl text-orange-400">
              <FiCalendar className="text-xl" />
            </div>
            <span className="font-bold text-sm">Date Planner</span>
            <span className="text-[10px] text-gray-500 -mt-2">12 Rencana Kencan</span>
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;