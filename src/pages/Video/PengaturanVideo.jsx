import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiClock, FiCalendar, FiColumns, FiGrid, FiArchive, FiLock } from 'react-icons/fi';

const PengaturanVideo = () => {
  const navigate = useNavigate();
  
  // Baca state awal dari LocalStorage khusus VIDEO
  // Default grid untuk video kita buat 2 agar ukurannya pas (bisa diubah ke 1 atau 3)
  const [gridSize, setGridSize] = useState(() => localStorage.getItem('video_gridSize') || '2'); 
  const [sortOrder, setSortOrder] = useState(() => localStorage.getItem('video_sortOrder') || 'newest'); 

  // Simpan ke LocalStorage tiap kali berubah agar sinkron dengan Video.jsx
  useEffect(() => {
    localStorage.setItem('video_gridSize', gridSize);
  }, [gridSize]);

  useEffect(() => {
    localStorage.setItem('video_sortOrder', sortOrder);
  }, [sortOrder]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-xl font-bold tracking-wide">Pengaturan Video</h1>
           <p className="text-xs text-[#D85482] font-semibold uppercase tracking-wider">Preferensi Sinema</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-3">
          {/* Menu Navigasi ke Arsip Video */}
          <button onClick={() => navigate('/video/arsip')} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 active:scale-95 hover:border-[#D85482]/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2A4480]/10 text-[#2A4480] rounded-xl"><FiArchive size={20} /></div>
              <div className="text-left">
                <span className="block font-bold text-[#2A3A6A]">Arsip Video</span>
                <span className="text-xs text-gray-500 font-medium">Video yang diarsipkan</span>
              </div>
            </div>
            <span className="text-gray-400 text-xl font-bold">›</span>
          </button>

          {/* Menu Navigasi ke Brankas Video */}
          <button onClick={() => navigate('/video/brankas')} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 active:scale-95 hover:border-[#D85482]/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#D85482]/10 text-[#D85482] rounded-xl"><FiLock size={20} /></div>
              <div className="text-left">
                <span className="block font-bold text-[#2A3A6A]">Brankas Video</span>
                <span className="text-xs text-gray-500 font-medium">Ruang rahasia dengan PIN</span>
              </div>
            </div>
            <span className="text-gray-400 text-xl font-bold">›</span>
          </button>

          {/* Menu Navigasi ke Baru Dihapus Video */}
          <button onClick={() => navigate('/video/barudihapus')} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 active:scale-95 hover:border-red-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-500 rounded-xl"><FiTrash2 size={20} /></div>
              <div className="text-left">
                <span className="block font-bold text-[#2A3A6A]">Baru Dihapus</span>
                <span className="text-xs text-gray-500 font-medium">Pulihkan video yang terhapus</span>
              </div>
            </div>
            <span className="text-gray-400 text-xl font-bold">›</span>
          </button>
        </div>

        {/* Preferensi Tampilan */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 mb-5 uppercase tracking-widest border-b border-gray-100 pb-3">
            Tampilan Visual
          </h3>

          <div className="flex flex-col gap-6">
            
            {/* Ukuran Grid */}
            <div>
              <p className="mb-3 text-sm font-bold text-[#2A3A6A]">Ukuran Grid (Kolom)</p>
              <div className="flex bg-[#FAFAFA] rounded-xl p-1 border border-gray-200">
                {/* Untuk Video, pilihan kolomnya kita buat 1, 2, atau 3 agar proporsional */}
                {['1', '2', '3'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      gridSize === size ? 'bg-[#2A4480] text-white shadow-md' : 'text-gray-400 hover:text-[#2A3A6A]'
                    }`}
                  >
                    {size === '1' ? <FiColumns size={16} /> : <FiGrid size={16} />}
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Urutan Video */}
            <div>
              <p className="mb-3 text-sm font-bold text-[#2A3A6A]">Urutkan Kenangan</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSortOrder('newest')}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    sortOrder === 'newest' ? 'border-[#D85482] bg-[#D85482]/5 text-[#D85482]' : 'border-gray-100 bg-[#FAFAFA] text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <FiClock size={20} />
                  <span className="text-xs font-bold">Terbaru</span>
                </button>
                <button 
                  onClick={() => setSortOrder('oldest')}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    sortOrder === 'oldest' ? 'border-[#D85482] bg-[#D85482]/5 text-[#D85482]' : 'border-gray-100 bg-[#FAFAFA] text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <FiCalendar size={20} />
                  <span className="text-xs font-bold">Terlama</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PengaturanVideo;