import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';

const PengaturanPlanner = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState(() => localStorage.getItem('planner_sortOrder') || 'newest'); 

  useEffect(() => {
    localStorage.setItem('planner_sortOrder', sortOrder);
  }, [sortOrder]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-xl font-bold tracking-wide">Pengaturan Planner</h1>
           <p className="text-xs text-[#D85482] font-semibold uppercase tracking-wider">Preferensi Jadwal</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <button onClick={() => navigate('/planner/plandihapus')} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 active:scale-95 hover:border-red-500/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-500 rounded-xl"><FiTrash2 size={20} /></div>
            <div className="text-left">
              <span className="block font-bold text-[#2A3A6A]">Rencana Dihapus</span>
              <span className="text-xs text-gray-500 font-medium">Pulihkan jadwal yang terhapus</span>
            </div>
          </div>
          <span className="text-gray-400 text-xl font-bold">›</span>
        </button>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 mb-5 uppercase tracking-widest border-b border-gray-100 pb-3">Tampilan</h3>
          <div>
            <p className="mb-3 text-sm font-bold text-[#2A3A6A]">Urutkan Jadwal</p>
            <div className="flex gap-3">
              <button onClick={() => setSortOrder('newest')} className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${sortOrder === 'newest' ? 'border-[#D85482] bg-[#D85482]/5 text-[#D85482]' : 'border-gray-100 bg-[#FAFAFA] text-gray-400'}`}>
                <FiClock size={20} />
                <span className="text-xs font-bold">Terdekat</span>
              </button>
              <button onClick={() => setSortOrder('oldest')} className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${sortOrder === 'oldest' ? 'border-[#D85482] bg-[#D85482]/5 text-[#D85482]' : 'border-gray-100 bg-[#FAFAFA] text-gray-400'}`}>
                <FiCalendar size={20} />
                <span className="text-xs font-bold">Terjauh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanPlanner;