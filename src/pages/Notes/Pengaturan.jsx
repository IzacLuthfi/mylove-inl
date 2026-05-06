import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiClock, FiEdit3 } from 'react-icons/fi';

const Pengaturan = () => {
  const navigate = useNavigate();
  
  // PERBAIKAN: Sinkronkan dengan Local Storage
  const [sortMode, setSortMode] = useState(() => localStorage.getItem('notes_sortBy') || 'created');

  // Menyimpan pengaturan setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('notes_sortBy', sortMode);
  }, [sortMode]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans">
      
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-xl font-bold tracking-wide">Pengaturan Notes</h1>
           <p className="text-xs text-[#D85482] font-semibold uppercase tracking-wider">Preferensi Pesan</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* PERBAIKAN: Menambahkan onClick navigate ke barudihapus */}
        <button onClick={() => navigate('/notes/barudihapus')} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 active:scale-95 hover:border-red-500/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-500 rounded-xl">
              <FiTrash2 size={20} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-[#2A3A6A]">Pesan Dihapus</span>
              <span className="text-xs text-gray-500 font-medium">Pulihkan pesan di tempat sampah</span>
            </div>
          </div>
          <span className="text-gray-400 text-xl font-bold">›</span>
        </button>

        {/* Preferensi Tampilan */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 mb-5 uppercase tracking-widest border-b border-gray-100 pb-3">
            Tampilan & Urutan
          </h3>

          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-sm font-bold text-[#2A3A6A]">Urutkan Berdasarkan</p>
              <div className="flex gap-3">
                <button onClick={() => setSortMode('created')} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${sortMode === 'created' ? 'border-[#D85482] bg-[#D85482]/5 text-[#D85482]' : 'border-gray-100 bg-[#FAFAFA] text-gray-400 hover:border-gray-200'}`}>
                  <FiClock size={20} />
                  <span className="text-xs font-bold">Waktu Dibuat</span>
                </button>
                <button onClick={() => setSortMode('edited')} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${sortMode === 'edited' ? 'border-[#D85482] bg-[#D85482]/5 text-[#D85482]' : 'border-gray-100 bg-[#FAFAFA] text-gray-400 hover:border-gray-200'}`}>
                  <FiEdit3 size={20} />
                  <span className="text-xs font-bold">Waktu Diedit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pengaturan;