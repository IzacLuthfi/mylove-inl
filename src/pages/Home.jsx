import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import Swal from 'sweetalert2';
import { 
  FiClock, FiCalendar, FiHeart, FiImage, 
  FiVideo, FiArrowRight, FiMapPin, FiSmile
} from 'react-icons/fi';

import LogoImg from '../assets/Logo.png';
import IzacImg from '../assets/Izac.png';
import LianImg from '../assets/Lian.png';

const Home = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState({ day: '', date: '' });
  const [nextPlan, setNextPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  
  // State untuk Love Counter
  const [loveDays, setLoveDays] = useState(0);

  // State untuk Mood Tracker
  const [todayMood, setTodayMood] = useState(null);
  const [moodStats, setMoodStats] = useState('');
  const [loadingMood, setLoadingMood] = useState(true);

  // Daftar Pilihan Mood
  const MOOD_OPTIONS = [
    { type: 'Sangat Bahagia', emoji: '🥰', color: 'bg-pink-100 text-pink-600 border-pink-300' },
    { type: 'Tenang & Damai', emoji: '😊', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { type: 'Kangen / Sedih', emoji: '😢', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { type: 'Ada Masalah', emoji: '😤', color: 'bg-red-100 text-red-600 border-red-300' }
  ];

  // Set Tanggal Hari Ini & Hitung Hari Jadian
  useEffect(() => {
    const today = new Date();
    const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' });
    const date = today.getDate();
    const month = today.toLocaleDateString('id-ID', { month: 'long' });
    const year = today.getFullYear();

    setCurrentDate({ day: dayName, date: `${date} ${month} ${year}` });

    // Hitung Love Counter (7 Oktober 2024)
    const anniversaryDate = new Date('2024-10-07T00:00:00');
    const diffTime = today.getTime() - anniversaryDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setLoveDays(diffDays > 0 ? diffDays : 0);
  }, []);

  // Fetch Kencan Terdekat
  useEffect(() => {
    const fetchNextPlan = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data } = await supabase
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
        console.log("No plan found");
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchNextPlan();
  }, []);

  // --- LOGIKA MOOD TRACKER ---
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA'); // Format YYYY-MM-DD lokal
        const formattedToday = new Date(todayStr).toISOString().split('T')[0];
        
        // 1. Cek mood hari ini
        const { data: todayData } = await supabase
          .from('moods')
          .select('*')
          .eq('date', formattedToday)
          .single();
        
        if (todayData) setTodayMood(todayData);

        // 2. Ambil data sebulan terakhir untuk statistik
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];

        const { data: monthData } = await supabase
          .from('moods')
          .select('mood_type')
          .gte('date', firstDayStr);

        if (monthData && monthData.length > 0) {
          // Cari mood paling dominan
          const moodCounts = {};
          let maxCount = 0;
          let dominantMood = '';

          monthData.forEach(item => {
            moodCounts[item.mood_type] = (moodCounts[item.mood_type] || 0) + 1;
            if (moodCounts[item.mood_type] > maxCount) {
              maxCount = moodCounts[item.mood_type];
              dominantMood = item.mood_type;
            }
          });

          const dominantEmoji = MOOD_OPTIONS.find(m => m.type === dominantMood)?.emoji || '✨';
          setMoodStats(`${dominantEmoji} ${dominantMood} (${maxCount} Hari)`);
        } else {
          setMoodStats('Belum ada data bulan ini');
        }
      } catch (error) {
        console.error("Mood fetch error:", error);
      } finally {
        setLoadingMood(false);
      }
    };

    fetchMoodData();
  }, []);

  // Simpan Mood
  const handleSaveMood = async (moodType) => {
    try {
      const todayStr = new Date().toLocaleDateString('en-CA'); 
      const formattedToday = new Date(todayStr).toISOString().split('T')[0];

      // Upsert: Masukkan baru, atau update jika tanggal sudah ada (karena date itu UNIQUE)
      const { data, error } = await supabase
        .from('moods')
        .upsert({ date: formattedToday, mood_type: moodType }, { onConflict: 'date' })
        .select()
        .single();

      if (error) throw error;
      
      setTodayMood(data);
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: 'Mood hari ini dicatat! 🥰', showConfirmButton: false, timer: 1500,
        customClass: { popup: 'rounded-2xl' }
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Gagal menyimpan mood.' });
    }
  };


  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-10 text-[#2A3A6A] animate-fadeIn selection:bg-[#D85482]/30">
      
      {/* 1. HEADER */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-4">
          <img src={LogoImg} alt="Logo MyLove" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
          <div className="leading-tight">
            <h2 className="text-xl font-bold text-[#2A3A6A]">{currentDate.day}</h2>
            <p className="text-xs font-semibold text-gray-500">{currentDate.date}</p>
          </div>
        </div>
        
        <div onClick={() => navigate('/profil')} className="flex -space-x-3 drop-shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all group">
          <img className="w-11 h-11 rounded-full border-2 border-white object-cover bg-gray-200 group-hover:border-[#D85482] transition-colors" src={LianImg} alt="Lian" />
          <img className="w-11 h-11 rounded-full border-2 border-white object-cover bg-gray-200 group-hover:border-[#2A4480] transition-colors" src={IzacImg} alt="Izac" />
        </div>
      </header>

      {/* 2. LOVE COUNTER */}
      <section className="px-6 mb-6 mt-2">
        <div className="bg-gradient-to-r from-[#D85482] to-[#f47ba8] rounded-[2rem] p-6 text-white shadow-xl shadow-[#D85482]/30 relative overflow-hidden flex items-center justify-between group cursor-default">
          <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <FiHeart size={140} className="fill-white" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/90 mb-1">Sudah Bersama Selama</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black drop-shadow-md">{loveDays}</h3>
              <span className="text-sm font-bold text-white/90">Hari</span>
            </div>
            <p className="text-xs text-white/90 mt-2 font-medium bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
              Sejak 7 Oktober 2024
            </p>
          </div>
          <div className="relative z-10 bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 shadow-inner">
            <FiHeart size={32} className="fill-white text-white animate-pulse" />
          </div>
        </div>
      </section>

      {/* 3. MOOD TRACKER (FITUR BARU) */}
      <section className="px-6 mb-8">
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#2A3A6A] flex items-center gap-2">
              <FiSmile className="text-[#D85482]" /> Mood Hubungan Hari Ini
            </h3>
            {/* Tampilkan Statistik Mini */}
            {!loadingMood && moodStats && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100" title="Mood dominan bulan ini">
                Statistik: {moodStats}
              </span>
            )}
          </div>

          {loadingMood ? (
             <div className="animate-pulse flex space-x-4"><div className="h-12 bg-gray-200 rounded-2xl w-full"></div></div>
          ) : todayMood ? (
            // Jika sudah diisi hari ini
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{MOOD_OPTIONS.find(m => m.type === todayMood.mood_type)?.emoji || '✨'}</span>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Tercatat</p>
                  <p className="text-sm font-bold text-[#2A3A6A]">{todayMood.mood_type}</p>
                </div>
              </div>
              <button onClick={() => setTodayMood(null)} className="text-xs font-bold text-[#D85482] bg-[#D85482]/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
                Ubah
              </button>
            </div>
          ) : (
            // Jika belum diisi hari ini
            <div>
              <p className="text-xs text-gray-500 font-medium mb-3 text-center">Bagaimana perasaan cerita cinta kalian hari ini?</p>
              <div className="grid grid-cols-4 gap-2">
                {MOOD_OPTIONS.map((mood, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSaveMood(mood.type)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${mood.color} hover:scale-105 active:scale-95 transition-all shadow-sm`}
                    title={mood.type}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. JADWAL TERDEKAT */}
      <section className="px-6 mb-8 overflow-hidden">
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

      {/* 5. MENU JELAJAH */}
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

      {/* 6. MAP KENANGAN */}
      <section className="px-6 mb-8">
        <div onClick={() => navigate('/kenangan')} className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <FiMapPin size={100} className="text-[#2A4480]" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-[#2A4480]/10 p-4 rounded-2xl">
              <FiMapPin size={28} className="text-[#2A4480]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2A3A6A] leading-tight">Peta Kenangan</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Jejak langkah tempat kita bersama</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TOMBOL TAMBAH RENCANA */}
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