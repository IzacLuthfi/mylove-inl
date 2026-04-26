import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiSettings, FiCalendar, FiHome, FiHeart } from 'react-icons/fi';

const Home = () => {
  // State untuk tanggal hari ini
  const [currentDate, setCurrentDate] = useState({ day: '', date: '' });

  useEffect(() => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }); // Contoh: Tuesday
    // Format tanggal: April 19th
    const date = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    
    // Logika untuk akhiran angka (st, nd, rd, th)
    const getOrdinalNum = (n) => {
      return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    };

    setCurrentDate({
      day: dayName,
      date: `${month} ${getOrdinalNum(date)}`
    });
  }, []);

  // Fungsi simulasi untuk tombol
  const handleAction = (action) => {
    alert(`Fitur ${action} akan segera aktif saat disambung ke database!`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 text-[#2A3A6A]">
      
      {/* 1. HEADER */}
      <header className="px-6 pt-10 pb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Logo Circle */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#2A3A6A]">
            <div className="w-8 h-8 bg-[#D85482] rounded-full"></div>
          </div>
          {/* Dynamic Date */}
          <div className="leading-tight">
            <h2 className="text-xl font-semibold text-[#2A3A6A]">{currentDate.day}</h2>
            <h2 className="text-xl font-semibold text-[#2A3A6A]">{currentDate.date}</h2>
          </div>
        </div>
        
        {/* Avatars (Simulasi Izac & Lian) */}
        <div className="flex -space-x-4">
          <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Lian" />
          <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Izac" />
        </div>
      </header>

      {/* 2. WHAT'S NEW SECTION */}
      <section className="px-6 mb-8">
        <h3 className="text-2xl font-bold text-[#2A3A6A] mb-4">What's new</h3>
        
        <div className="bg-[#2A4480] rounded-[2rem] p-6 relative overflow-hidden text-white shadow-lg">
          {/* Ilustrasi Hati (Custom Shape) */}
          <div className="absolute right-4 top-6 flex items-start gap-1">
            <FiHeart size={50} className="text-[#D85482] fill-[#D85482] drop-shadow-md" />
            <div className="w-4 h-4 bg-[#D85482] rounded-full mt-2 shadow-md"></div>
          </div>

          <h4 className="text-xl font-bold mb-4">Date Planned</h4>
          <div className="mb-6">
            <p className="font-semibold text-white/90">Date Night</p>
            <p className="text-sm text-white/80 leading-relaxed max-w-[60%]">
              Sat 30 Apr 7:30pm at<br/>Peach Pit
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleAction('Confirm')} className="px-5 py-1.5 border border-white rounded-full text-xs font-bold uppercase tracking-wide hover:bg-white/10 transition">
              Confirm
            </button>
            <button onClick={() => handleAction('Decline')} className="px-5 py-1.5 border border-white rounded-full text-xs font-bold uppercase tracking-wide hover:bg-white/10 transition">
              Decline
            </button>
            <button onClick={() => handleAction('Update')} className="px-5 py-1.5 border border-white rounded-full text-xs font-bold uppercase tracking-wide hover:bg-white/10 transition">
              Update
            </button>
          </div>
        </div>
      </section>

      {/* 3. YOUR NEXT DATE SECTION */}
      <section className="px-6 mb-8">
        <h3 className="text-2xl font-bold text-[#2A3A6A] mb-4">Your next date</h3>
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
          
          {/* Card 1: Gambar Restoran */}
          <div className="min-w-[200px] h-[220px] rounded-[2rem] overflow-hidden relative shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" 
              alt="Restaurant" 
              className="w-full h-full object-cover"
            />
            {/* Tag Tanggal */}
            <div className="absolute bottom-4 right-4 bg-[#F8F7F4] rounded-xl px-4 py-2 flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-[#D85482] leading-none">21</span>
              <span className="text-xs font-bold text-[#2A4480]">NOV</span>
            </div>
          </div>

          {/* Card 2: Detail Kencan */}
          <div className="min-w-[200px] h-[220px] bg-[#2A4480] rounded-[2rem] p-6 relative flex flex-col justify-end shadow-md">
            {/* Ilustrasi Hati */}
            <div className="absolute left-6 top-6 flex items-start gap-1">
              <FiHeart size={50} className="text-[#D85482] fill-[#D85482] drop-shadow-md" />
              <div className="w-4 h-4 bg-[#D85482] rounded-full mt-2 shadow-md"></div>
            </div>
            
            <div className="text-white mt-auto">
              <h4 className="font-bold mb-1">Dinner Date</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Saturday 7:30pm at<br/>The French Café
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PLAN A DATE SECTION */}
      <section className="px-6">
        <h3 className="text-2xl font-bold text-[#2A3A6A] mb-4">Plan a date</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Kotak Kiri (Hati) */}
          <Link to="/planner/new" className="aspect-square bg-[#2A4480] rounded-[2rem] flex items-center justify-center shadow-md hover:scale-95 transition-transform">
            <div className="flex items-start gap-1">
              <FiHeart size={60} className="text-[#D85482] fill-[#D85482] drop-shadow-md" />
              <div className="w-5 h-5 bg-[#D85482] rounded-full mt-2 shadow-md"></div>
            </div>
          </Link>

          {/* Kotak Kanan (Jam) */}
          <Link to="/planner/schedule" className="aspect-square bg-[#2A4480] rounded-[2rem] flex items-center justify-center shadow-md hover:scale-95 transition-transform">
            <div className="bg-[#F8F7F4] w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-md">
              <FiClock size={36} className="text-[#2A4480]" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. BOTTOM NAVIGATION BAR (Mockup) */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#FAFAFA] border-t border-gray-200 px-6 py-4 flex justify-between items-center z-50 pb-safe">
        <Link to="/" className="flex flex-col items-center gap-1 text-[#2A3A6A]">
          <div className="relative">
            <FiHome size={28} className="fill-current" />
            <div className="absolute -top-1 -right-2 w-3 h-3 bg-[#D85482] rounded-full border border-white"></div>
          </div>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        
        <Link to="/hints" className="flex flex-col items-center gap-1 text-black">
          <div className="flex items-start">
            <FiHeart size={28} className="fill-current" />
            <div className="w-2 h-2 bg-black rounded-full mt-1 ml-0.5"></div>
          </div>
          <span className="text-[10px] font-bold">Hints</span>
        </Link>

        <Link to="/calendar" className="flex flex-col items-center gap-1 text-black">
          <div className="flex items-start">
            <div className="w-7 h-7 bg-black rounded-sm"></div>
            <div className="w-2 h-2 bg-black rounded-full mt-1 ml-1"></div>
          </div>
          <span className="text-[10px] font-bold">Calendar</span>
        </Link>

        <Link to="/settings" className="flex flex-col items-center gap-1 text-black">
          <div className="flex items-start">
            <FiSettings size={28} className="fill-current" />
            <div className="w-2 h-2 bg-black rounded-full mt-1 ml-0.5"></div>
          </div>
          <span className="text-[10px] font-bold">Settings</span>
        </Link>
      </nav>

    </div>
  );
};

export default Home;