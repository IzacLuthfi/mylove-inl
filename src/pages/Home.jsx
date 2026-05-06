import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiClock, FiCalendar, FiHeart, FiImage, 
  FiVideo, FiArrowRight, FiMapPin 
} from 'react-icons/fi';


import LogoImg from '../assets/Logo.png';
import IzacImg from '../assets/Izac.png';
import LianImg from '../assets/Lian.png';

const Home = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState({ day: '', date: '' });
  const [nextPlan, setNextPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  // Set Tanggal Hari Ini (Format Indonesia)
  useEffect(() => {
    const today = new Date();
    const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' });
    const date = today.getDate();
    const month = today.toLocaleDateString('id-ID', { month: 'long' });
    const year = today.getFullYear();

    setCurrentDate({
      day: dayName,
      date: `${date} ${month} ${year}`
    });
  }, []);

  // Tarik Data Kencan Terdekat dari Supabase
  useEffect(() => {
    const fetchNextPlan = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('planners')
          .select('*')
          .eq('is_deleted', false)
          .eq('status', 'planned')
          .gte('date', todayStr)
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(1)
          .single();
          
        if (data) setNextPlan(data);
      } catch (error) {
        console.log("Belum ada rencana atau error:", error.message);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchNextPlan();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-10 text-[#2A3A6A] animate-fadeIn selection:bg-[#D85482]/30">
      
      {/* 1. HEADER (Profil & Tanggal) */}
      <header className="px-6 pt-10 pb-6 flex justify-between items-center sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-4">
          
          {/* LOGO APLIKASI */}
          <img 
            src={LogoImg} 
            alt="Logo MyLove" 
            className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" 
          />
          
          <div className="leading-tight">
            <h2 className="text-xl font-bold text-[#2A3A6A]">{currentDate.day}</h2>
            <p className="text-xs font-semibold text-gray-500">{currentDate.date}</p>
          </div>
        </div>
        
        {/* AVATAR IZAC & LIAN */}
        <div className="flex -space-x-3 drop-shadow-md">
          <img 
            className="w-11 h-11 rounded-full border-2 border-white object-cover bg-gray-200" 
            src={LianImg} 
            alt="Lian" 
          />
          <img 
            className="w-11 h-11 rounded-full border-2 border-white object-cover bg-gray-200" 
            src={IzacImg} 
            alt="Izac" 
          />
        </div>
      </header>

      {/* 2. JADWAL TERDEKAT */}
      <section className="px-6 mb-8 mt-2 overflow-hidden">
        <h3 className="text-xl font-bold text-[#2A3A6A] mb-4 flex items-center gap-2">
          Jadwal Terdekat <span className="bg-[#D85482] w-2 h-2 rounded-full animate-pulse"></span>
        </h3>
        
        {loadingPlan ? (
          <div className="bg-gray-100 rounded-[2rem] p-6 h-32 animate-pulse flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A4480]"></div>
          </div>
        ) : nextPlan ? (
          <div onClick={() => navigate('/planner')} className="bg-[#2A4480] rounded-[2rem] p-6 relative overflow-hidden text-white shadow-xl shadow-[#2A4480]/30 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
            <div className="absolute -right-4 -top-2 opacity-20 pointer-events-none">
              <FiHeart size={120} className="fill-current" />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                Akan Datang
              </span>
              <div className="bg-white text-[#2A4480] w-10 h-10 rounded-full flex flex-col items-center justify-center shadow-md leading-none shrink-0">
                <span className="text-sm font-black">{new Date(nextPlan.date).getDate()}</span>
              </div>
            </div>

            <h4 className="text-2xl font-bold mb-1 relative z-10 leading-tight line-clamp-2">{nextPlan.title}</h4>
            
            <div className="flex flex-col gap-1 mt-3 relative z-10">
              <p className="text-xs text-white/80 font-medium flex items-center gap-2">
                <FiClock size={12} className="shrink-0" /> {new Date(nextPlan.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric'})} • {nextPlan.time?.slice(0,5) || '-'} WIB
              </p>
              {nextPlan.location && (
                <p className="text-xs text-white/80 font-medium flex items-center gap-2">
                  <FiMapPin size={12} className="shrink-0" /> {nextPlan.location}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#FAFAFA] border-2 border-dashed border-gray-200 rounded-[2rem] p-6 text-center shadow-sm">
            <div className="bg-[#D85482]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCalendar className="text-[#D85482]" size={24} />
            </div>
            <h4 className="text-sm font-bold text-[#2A3A6A] mb-1">Belum ada agenda</h4>
            <p className="text-xs text-gray-400 mb-4">Ayo rencanakan kencan seru bulan ini!</p>
            <Link to="/planner/form" className="inline-block bg-[#D85482] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-[#c04770] transition-colors active:scale-95">
              Buat Rencana
            </Link>
          </div>
        )}
      </section>

      {/* 3. MENU JELAJAH */}
      <section className="px-6 mb-8">
        <h3 className="text-xl font-bold text-[#2A3A6A] mb-4">Jelajahi Kenangan</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Link to="/gallery" className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D85482]/30 transition-all active:scale-95 group">
            <div className="bg-[#D85482]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiImage size={20} className="text-[#D85482]" />
            </div>
            <h4 className="font-bold text-[#2A3A6A] text-sm">Galeri Foto</h4>
            <p className="text-[10px] text-gray-400 mt-1">Momen-momen manis</p>
          </Link>

          <Link to="/video" className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2A4480]/30 transition-all active:scale-95 group">
            <div className="bg-[#2A4480]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiVideo size={20} className="text-[#2A4480]" />
            </div>
            <h4 className="font-bold text-[#2A3A6A] text-sm">Sinema I&L</h4>
            <p className="text-[10px] text-gray-400 mt-1">Video kenangan kita</p>
          </Link>

          <Link to="/planner" className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2A4480]/30 transition-all active:scale-95 group col-span-2 flex items-center justify-between">
            <div>
              <div className="bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center mb-2 group-hover:bg-[#2A4480]/10 transition-colors">
                <FiCalendar size={20} className="text-gray-600 group-hover:text-[#2A4480] transition-colors" />
              </div>
              <h4 className="font-bold text-[#2A3A6A] text-sm">Date Planner</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Jadwal kencan kita</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-full text-gray-400 group-hover:bg-[#D85482] group-hover:text-white transition-all">
              <FiArrowRight size={18} />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. TOMBOL TAMBAH RENCANA */}
      <section className="px-6 mb-12">
        <Link to="/planner/form" className="w-full bg-[#2A4480] text-white rounded-[1.5rem] p-4 flex items-center justify-center gap-2 shadow-lg shadow-[#2A4480]/20 active:scale-95 transition-transform hover:bg-[#1f3360]">
          <div className="bg-white/20 p-1.5 rounded-full">
            <FiHeart size={16} className="fill-white" />
          </div>
          <span className="font-bold text-sm">Rencanakan Kencan Baru</span>
        </Link>
      </section>

    </div>
  );
};

export default Home;