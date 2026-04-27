import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from "@/config/supabaseClient";
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

  // Simulasi data rencana kencan (Disesuaikan warnanya dengan tema baru)
  const dummyPlans = [
    {
      id: 1,
      title: 'Anniversary Dinner 🍷',
      date: '14 Feb 2024',
      time: '19:00 WIB',
      location: 'Skyview Restaurant',
      status: 'upcoming',
      bgColor: 'bg-[#2A4480]', // Navy
      textColor: 'text-white',
      accentColor: 'text-white/80',
      iconBg: 'bg-white/20'
    },
    {
      id: 2,
      title: 'Nonton Bioskop',
      date: '18 Feb 2024',
      time: '15:30 WIB',
      location: 'CGV Mall Pusat',
      status: 'upcoming',
      bgColor: 'bg-[#D85482]', // Pink
      textColor: 'text-white',
      accentColor: 'text-white/90',
      iconBg: 'bg-white/20'
    },
    {
      id: 3,
      title: 'Piknik Sore di Taman',
      date: '10 Feb 2024',
      time: '16:00 WIB',
      location: 'Taman Kota',
      status: 'completed',
      bgColor: 'bg-white',
      textColor: 'text-gray-400',
      accentColor: 'text-gray-400',
      iconBg: 'bg-gray-100'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 font-sans text-[#2A3A6A] animate-fadeIn selection:bg-[#D85482]/30">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Date Planner</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">MyLove I&L Schedule</p>
          </div>
        </div>
        <div className="bg-[#2A4480]/10 p-2.5 rounded-xl text-[#2A4480]">
          <FiCalendar size={20} />
        </div>
      </header>

      {/* 2. MINI CALENDAR (Date Strip) */}
      <section className="mt-6 px-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-[#2A3A6A]">Februari 2024</h2>
          <button className="text-xs text-[#D85482] font-bold bg-[#D85482]/10 hover:bg-[#D85482]/20 px-3 py-1.5 rounded-lg transition-colors">
            Hari Ini
          </button>
        </div>
        
        <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hide pb-2">
          {dates.map((item, index) => (
            <button 
              key={index}
              onClick={() => setActiveDate(item.date)}
              className={`flex flex-col items-center min-w-[55px] p-3 rounded-2xl border transition-all active:scale-90 ${
                activeDate === item.date 
                  ? 'bg-[#2A4480] border-[#2A4480] shadow-lg shadow-[#2A4480]/20 text-white transform -translate-y-1' 
                  : 'bg-white border-gray-200 text-gray-500 hover:border-[#2A4480]/30 hover:bg-gray-50'
              }`}
            >
              <span className={`text-xs font-semibold mb-1 ${activeDate === item.date ? 'text-white/80' : 'text-gray-400'}`}>
                {item.day}
              </span>
              <span className={`text-lg font-bold ${activeDate === item.date ? 'text-white' : 'text-[#2A3A6A]'}`}>
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. UPCOMING PLANS SECTION */}
      <section className="px-6 mt-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#2A4480] mb-5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D85482] animate-pulse"></span>
          Akan Datang
        </h3>
        
        <div className="flex flex-col gap-5">
          {dummyPlans.filter(plan => plan.status === 'upcoming').map(plan => (
            <div 
              key={plan.id} 
              className={`${plan.bgColor} p-6 rounded-[2rem] shadow-md relative group cursor-pointer active:scale-95 transition-transform`}
            >
              
              <div className="flex justify-between items-start mb-5">
                <div className={`p-3 rounded-2xl ${plan.iconBg} ${plan.textColor} backdrop-blur-sm shadow-sm`}>
                  <FiCalendar size={22} />
                </div>
                <button className={`${plan.textColor} opacity-80 hover:opacity-100 p-1 transition-opacity`}>
                  <FiMoreVertical size={20} />
                </button>
              </div>

              <h4 className={`font-bold text-2xl ${plan.textColor} mb-4 leading-tight tracking-wide`}>
                {plan.title}
              </h4>
              
              <div className={`flex flex-col gap-2.5 text-sm ${plan.accentColor} font-medium`}>
                <div className="flex items-center gap-3">
                  <FiClock size={16} />
                  <span>{plan.date} • {plan.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin size={16} />
                  <span>{plan.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPLETED PLANS SECTION */}
      <section className="px-6 mt-8 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
          <FiCheckCircle size={16} /> Kenangan Terlewati
        </h3>
        
        <div className="flex flex-col gap-3">
          {dummyPlans.filter(plan => plan.status === 'completed').map(plan => (
            <div key={plan.id} className="bg-gray-100 p-5 rounded-[1.5rem] border border-gray-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#2A3A6A] line-through decoration-gray-400 decoration-2 opacity-60">
                  {plan.title}
                </h4>
                <p className="text-xs font-medium text-gray-400 mt-1">{plan.date}</p>
              </div>
              <div className="bg-white p-2 rounded-full shadow-sm">
                <FiCheckCircle className="text-green-500" size={20} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FLOATING ACTION BUTTON (Buat Rencana Baru) */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          className="bg-[#D85482] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-2 border-white"
        >
          <FiPlus size={24} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
};

export default Planner;