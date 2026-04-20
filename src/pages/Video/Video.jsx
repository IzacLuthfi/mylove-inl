import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlay, FiPlus, FiVideo, 
  FiClock, FiHeart, FiMoreVertical, FiFilm 
} from 'react-icons/fi';

const Video = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Vlog Liburan', 'Kejutan 🎁', 'Random TikTok', 'Deep Talks'];

  // Simulasi data video
  const dummyVideos = [
    {
      id: 1,
      title: 'Kejutan Ulang Tahun Lian',
      duration: '03:45',
      date: '12 Jan 2024',
      views: 'Ditonton 12x',
      thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8892bc952f?w=500&auto=format',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Pantai Pasir Putih',
      duration: '01:15',
      date: '20 Des 2023',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format',
      isFeatured: false
    },
    {
      id: 3,
      title: 'Masak Bareng (Gagal 😂)',
      duration: '05:20',
      date: '15 Nov 2023',
      thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?w=500&auto=format',
      isFeatured: false
    },
    {
      id: 4,
      title: 'Cover Lagu Buat Izac',
      duration: '02:30',
      date: '02 Nov 2023',
      thumbnail: 'https://images.unsplash.com/photo-1516280440502-859eb5386f68?w=500&auto=format',
      isFeatured: false
    },
    {
      id: 5,
      title: 'Jalan-jalan Sore',
      duration: '00:45',
      date: '10 Okt 2023',
      thumbnail: 'https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?w=500&auto=format',
      isFeatured: false
    }
  ];

  const featuredVideo = dummyVideos.find(v => v.isFeatured);
  const regularVideos = dummyVideos.filter(v => !v.isFeatured);

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
          <h1 className="text-xl font-bold text-white tracking-wide">Galeri Video</h1>
        </div>
        <div className="bg-purple-500/10 p-2 rounded-xl text-purple-400">
          <FiFilm size={20} />
        </div>
      </header>

      {/* 2. FEATURED VIDEO (Sorotan Utama) */}
      <section className="px-6 mt-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
          <FiPlay size={14} className="fill-purple-400" /> Sedang Hangat
        </h2>
        
        <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/20 group cursor-pointer active:scale-95 transition duration-300 border border-white/10">
          <img 
            src={featuredVideo.thumbnail} 
            alt="Featured" 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          
          {/* Gradient Overlay biar teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
          
          {/* Tombol Play Besar di Tengah */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white shadow-lg transform group-hover:scale-110 transition duration-300">
              <FiPlay size={32} className="fill-white ml-1" />
            </div>
          </div>

          {/* Info Teks di Bawah */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex justify-between items-end">
              <div>
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block">
                  Sorotan
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">{featuredVideo.title}</h3>
                <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
                  <FiClock size={12} /> {featuredVideo.duration} • {featuredVideo.views}
                </p>
              </div>
              <button className="text-white/70 hover:text-white">
                <FiHeart size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLS (Horizontal Scroll) */}
      <section className="mt-8 pl-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide pr-6">
          {categories.map((category, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-medium transition active:scale-95 ${
                activeCategory === category 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                  : 'bg-[#1E293B] text-gray-400 border border-white/5 hover:bg-[#26334A]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 4. VIDEO GRID */}
      <section className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Semua Video</h2>
          <span className="text-xs text-gray-500">32 File</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {regularVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer active:scale-95 transition">
              {/* Thumbnail Container */}
              <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-2 border border-white/5 shadow-md">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                
                {/* Durasi Badge */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <FiClock size={10} /> {video.duration}
                </div>

                {/* Play Icon (Muncul saat hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="bg-white/30 backdrop-blur-sm p-3 rounded-full text-white">
                    <FiPlay size={20} className="fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Judul & Tanggal */}
              <div className="px-1">
                <h4 className="text-sm font-bold text-gray-200 truncate">{video.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{video.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FLOATING ACTION BUTTON (Upload Video) */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-purple-600/40 hover:scale-105 transition active:scale-90 flex items-center gap-2 border border-purple-400/50">
          <FiVideo size={22} />
        </button>
      </div>

    </div>
  );
};

export default Video;