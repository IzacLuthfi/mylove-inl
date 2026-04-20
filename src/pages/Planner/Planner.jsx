import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlus, FiCalendar, FiClock, 
  FiMapPin, FiCheckCircle, FiMoreVertical 
} from 'react-icons/fi';

const Planner = () => {
  const navigate = useNavigate();
  
  // Simulasi state kalender mini (Hanya untuk UI)
  const [activeDate, setActiveDate] = useState(14);
  const dates = [
    { day: 'Sen', date: 12 }, { day: 'Sel', date: 13 },
    { day: 'Rab', date: 14 }, { day: 'Kam', date: 15 },
    { day: 'Jum', date: 16 }, { day: 'Sab', date: 17 }
  ];

  // Simulasi data rencana kencan
  const dummyPlans = [
    {
      id: 1,
      title: 'Anniversary Dinner 🍷',
      date: '14 Feb 2024',
      time: '19:00 WIB',
      location: 'Skyview Restaurant',
      status: 'upcoming',
      color: 'from-purple-500/20 to-pink-600/10',
      accent: 'text-pink-400'
    },
    {
      id: 2,
      title: 'Nonton Bioskop (Horor)',
      date: '18 Feb 2024',
      time: '15:30 WIB',
      location: 'CGV Mall Pusat',
      status: 'upcoming',
      color: 'from-blue-500/20 to-cyan-600/10',
      accent: 'text-blue-400'
    },
    {
      id: 3,
      title: 'Piknik Sore di Taman',
      date: '10 Feb 2024',
      time: '16:00 WIB',
      location: 'Taman Kota',
      status: 'completed',
      color: 'from-gray-500/10 to-gray-600/5',
      accent: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24 font-sans animate-fadeIn">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/5 rounded-xl text-white active:scale-90 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white tracking-wide">Date Planner</h1>
        </div>
        <div className="bg-white/5 p-2 rounded-xl text-orange-400">
          <FiCalendar size={20} />
        </div>
      </header>

      {/* 2. MINI CALENDAR (Date Strip) */}
      <section className="mt-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Februari 2024</h2>
          <button className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-3 py-1.5 rounded-lg">
            Hari Ini
          </button>
        </div>
        <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hide pb-2">
          {dates.map((item, index) => (
            <button 
              key={index}
              onClick={() => setActiveDate(item.date)}
              className={`flex flex-col items-center min-w-[50px] p-3 rounded-2xl border transition active:scale-90 ${
                activeDate === item.date 
                  ? 'bg-gradient-to-b from-blue-500 to-indigo-600 border-blue-400 shadow-lg shadow-blue-900/30 text-white' 
                  : 'bg-[#1E293B] border-white/5 text-gray-400 hover:bg-[#26334A]'
              }`}
            >
              <span className="text-xs font-medium mb-1">{item.day}</span>
              <span className={`text-lg font-bold ${activeDate === item.date ? 'text-white' : 'text-gray-200'}`}>
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. UPCOMING PLANS SECTION */}
      <section className="px-6 mt-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Akan Datang
        </h3>
        
        <div className="flex flex-col gap-4">
          {dummyPlans.filter(plan => plan.status === 'upcoming').map(plan => (
            <div key={plan.id} className={`bg-gradient-to-br ${plan.color} p-5 rounded-[2rem] border border-white/10 shadow-lg relative group cursor-pointer active:scale-95 transition`}>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-[#0F172A]/50 backdrop-blur-sm ${plan.accent}`}>
                  <FiCalendar size={20} />
                </div>
                <button className="text-gray-400 p-1">
                  <FiMoreVertical size={20} />
                </button>
              </div>

              <h4 className="font-bold text-xl text-white mb-3">{plan.title}</h4>
              
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <FiClock className={plan.accent} />
                  <span>{plan.date} • {plan.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className={plan.accent} />
                  <span>{plan.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPLETED PLANS SECTION */}
      <section className="px-6 mt-8 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
          <FiCheckCircle size={14} /> Kenangan Terlewati
        </h3>
        
        <div className="flex flex-col gap-3">
          {dummyPlans.filter(plan => plan.status === 'completed').map(plan => (
            <div key={plan.id} className="bg-[#1E293B] p-4 rounded-[1.5rem] border border-white/5 flex items-center justify-between opacity-70">
              <div>
                <h4 className="font-bold text-sm text-gray-300 line-through decoration-gray-500">{plan.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{plan.date}</p>
              </div>
              <FiCheckCircle className="text-green-500/50" size={20} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. FLOATING ACTION BUTTON (Buat Rencana Baru) */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-[1.5rem] shadow-xl shadow-blue-500/30 hover:scale-105 transition active:scale-90 flex items-center justify-center border border-blue-400/50">
          <FiPlus size={24} />
        </button>
      </div>

    </div>
  );
};

export default Planner;