import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlay, FiVideo, 
  FiClock, FiHeart, FiFilm 
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
            <h1 className="text-xl font-bold tracking-wide">Galeri Video</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">MyLove I&L Cinema</p>
          </div>
        </div>
        <div className="bg-[#D85482]/10 p-2.5 rounded-xl text-[#D85482]">
          <FiFilm size={20} />
        </div>
      </header>

      {/* 2. FEATURED VIDEO (Sorotan Utama) */}
      <section className="px-6 mt-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#D85482] mb-4 flex items-center gap-2">
          <FiPlay size={14} className="fill-[#D85482]" /> Sedang Hangat
        </h2>
        
        <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl shadow-[#2A4480]/20 group cursor-pointer active:scale-95 transition-transform duration-300 bg-gray-200 border border-gray-100">
          <img 
            src={featuredVideo.thumbnail} 
            alt="Featured" 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          
          {/* Gradient Overlay (Navy tone) biar teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A4480] via-[#2A4480]/40 to-transparent opacity-90"></div>
          
          {/* Tombol Play Besar di Tengah */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white shadow-lg transform group-hover:scale-110 transition duration-300">
              <FiPlay size={32} className="fill-white ml-1" />
            </div>
          </div>

          {/* Info Teks di Bawah */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="bg-[#D85482] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                  Sorotan Utama
                </span>
                <h3 className="text-xl font-bold text-white leading-tight mb-1 tracking-wide">{featuredVideo.title}</h3>
                <p className="text-xs text-white/80 font-medium flex items-center gap-2">
                  <FiClock size={12} /> {featuredVideo.duration} • {featuredVideo.views}
                </p>
              </div>
              <button className="text-white/70 hover:text-[#D85482] transition-colors active:scale-75">
                <FiHeart size={26} />
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
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                activeCategory === category 
                  ? 'bg-[#2A4480] text-white shadow-lg shadow-[#2A4480]/30 transform -translate-y-0.5' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2A4480]/30 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 4. VIDEO GRID */}
      <section className="px-6 mt-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Semua Video</h2>
          <span className="text-xs font-bold text-[#2A4480] bg-[#2A4480]/10 px-3 py-1 rounded-lg">32 File</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {regularVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer active:scale-95 transition-transform">
              
              {/* Thumbnail Container */}
              <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-3 border border-gray-100 shadow-sm bg-gray-200">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                
                {/* Overlay Hitam Halus Saat Hover */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                
                {/* Durasi Badge */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <FiClock size={10} /> {video.duration}
                </div>

                {/* Play Icon (Muncul saat hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/30 backdrop-blur-md p-3 rounded-full text-white shadow-lg transform group-hover:scale-110 transition">
                    <FiPlay size={20} className="fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Judul & Tanggal */}
              <div className="px-1">
                <h4 className="text-sm font-bold text-[#2A3A6A] leading-snug line-clamp-2">{video.title}</h4>
                <p className="text-[10px] font-medium text-gray-400 mt-1">{video.date}</p>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 5. FLOATING ACTION BUTTON (Upload Video) */}
      <div className="fixed bottom-24 right-6 z-40">
        <button className="bg-[#D85482] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 border-2 border-white">
          <FiVideo size={24} />
        </button>
      </div>

    </div>
  );
};

export default Video;