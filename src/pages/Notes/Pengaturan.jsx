import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiList, FiGrid, FiClock, FiEdit3 } from 'react-icons/fi';

const Pengaturan = () => {
  const navigate = useNavigate();
  
  // State dummy biar UI terlihat interaktif saat diklik
  // Nantinya nilai ini bisa kamu simpan di LocalStorage / Context API
  const [viewMode, setViewMode] = useState('list');
  const [sortMode, setSortMode] = useState('created');

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold tracking-wide">Pengaturan</h1>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Navigasi Arsip */}
        <button 
          onClick={() => navigate('/notes/arsip')} // Pastikan path ini sesuai route kamu
          className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 text-pink-400 rounded-lg">
              <FiTrash2 size={20} />
            </div>
            <span className="font-medium text-blue-50">Arsip Pesan Dihapus</span>
          </div>
          <span className="text-gray-500 text-xl">›</span>
        </button>

        {/* Preferensi Tampilan */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
          <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
            Preferensi Tampilan
          </h3>

          <div className="flex flex-col gap-5">
            
            {/* Toggle List/Grid */}
            <div>
              <p className="mb-3 text-sm text-blue-50">Tampilan Daftar Pesan</p>
              <div className="flex bg-[#1E293B] rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'list' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiList size={16} /> List
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiGrid size={16} /> Grid
                </button>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Toggle Urutan */}
            <div>
              <p className="mb-3 text-sm text-blue-50">Urutkan Berdasarkan</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSortMode('created')}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    sortMode === 'created' ? 'border-pink-500/50 bg-pink-500/10 text-pink-300' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FiClock size={20} />
                  <span className="text-xs">Waktu Dibuat</span>
                </button>
                <button 
                  onClick={() => setSortMode('edited')}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    sortMode === 'edited' ? 'border-pink-500/50 bg-pink-500/10 text-pink-300' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FiEdit3 size={20} />
                  <span className="text-xs">Waktu Diedit</span>
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