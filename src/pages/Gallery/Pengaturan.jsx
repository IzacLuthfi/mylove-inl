import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiClock, FiCalendar, FiColumns, FiGrid } from 'react-icons/fi';

const PengaturanGaleri = () => {
  const navigate = useNavigate();
  
  // State dummy untuk UI Interaktif (bisa disambung ke LocalStorage nantinya)
  const [gridSize, setGridSize] = useState('3'); // 2, 3, atau 4 kolom
  const [sortOrder, setSortOrder] = useState('newest'); // newest atau oldest

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Pengaturan Galeri</h1>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Menu Navigasi ke Arsip */}
        <button 
          onClick={() => navigate('/gallery/arsip')} // Sesuaikan dengan route kamu di App.jsx
          className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all duration-300 active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
              <FiTrash2 size={20} />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-blue-50">Arsip Foto</span>
              <span className="text-xs text-gray-400">Lihat foto yang disembunyikan</span>
            </div>
          </div>
          <span className="text-gray-500 text-xl">›</span>
        </button>

        {/* Preferensi Tampilan */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs font-bold text-gray-500 mb-5 uppercase tracking-widest">
            Tampilan Galeri
          </h3>

          <div className="flex flex-col gap-6">
            
            {/* Ukuran Grid */}
            <div>
              <p className="mb-3 text-sm font-medium text-blue-50">Ukuran Grid (Kolom)</p>
              <div className="flex bg-[#1E293B] rounded-xl p-1 border border-white/5">
                {['2', '3', '4'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      gridSize === size 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {size === '2' ? <FiColumns size={16} /> : <FiGrid size={16} />}
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Urutan Foto */}
            <div>
              <p className="mb-3 text-sm font-medium text-blue-50">Urutkan Berdasarkan</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSortOrder('newest')}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    sortOrder === 'newest' 
                      ? 'border-pink-500/50 bg-pink-500/10 text-pink-300' 
                      : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FiClock size={20} />
                  <span className="text-xs font-medium">Terbaru</span>
                </button>
                <button 
                  onClick={() => setSortOrder('oldest')}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    sortOrder === 'oldest' 
                      ? 'border-pink-500/50 bg-pink-500/10 text-pink-300' 
                      : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FiCalendar size={20} />
                  <span className="text-xs font-medium">Terlama</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PengaturanGaleri;