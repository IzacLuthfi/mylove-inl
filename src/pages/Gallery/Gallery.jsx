import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlus, FiFolder, FiMoreVertical, 
  FiImage, FiMaximize2, FiHeart 
} from 'react-icons/fi';


const Gallery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);

  // Simulasi data album (Nanti bisa ditarik dari database)
  const dummyAlbums = [
    { id: 1, name: 'Liburan Bareng', count: 42, cover: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&auto=format' },
    { id: 2, name: 'Makan Malam', count: 12, cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format' },
    { id: 3, name: 'Random Moments', count: 128, cover: 'https://images.unsplash.com/photo-1516589174184-c68d8e5f0b4a?w=500&auto=format' },
  ];

  useEffect(() => {
    // Di sini nanti kita akan memanggil data asli dari Supabase
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/5 rounded-xl text-white active:scale-90 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Galeri Foto</h1>
        </div>
        <button className="p-2 text-gray-400">
          <FiMoreVertical size={20} />
        </button>
      </header>

      {/* 2. ALBUMS SECTION (Horizontal Scroll) */}
      <section className="mt-6 pl-6">
        <div className="flex justify-between items-center pr-6 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Album Kenangan</h2>
          <button className="text-xs text-blue-400 font-semibold flex items-center gap-1">
            <FiPlus /> Buat Baru
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {dummyAlbums.map((album) => (
            <div key={album.id} className="min-w-[140px] group cursor-pointer">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-3 shadow-lg border border-white/5">
                <img 
                  src={album.cover} 
                  alt={album.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <FiFolder className="text-white/70 text-xs mb-1" />
                  <p className="text-[10px] text-white/80">{album.count} Foto</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-200 px-1 truncate">{album.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RECENT PHOTOS GRID */}
      <section className="mt-8 px-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">Semua Momen</h2>
        
        {loading ? (
          // Loader sederhana saat data sedang diambil
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {/* Loop Foto (Contoh gambar random dari Unsplash) */}
            {[...Array(12)].map((_, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group active:scale-95 transition">
                <img 
                  src={`https://picsum.photos/seed/${i + 20}/400/400`} 
                  alt="Kenangan"
                  className="w-full h-full object-cover"
                />
                {/* Overlay saat di-hover/touch */}
                <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <FiHeart className="text-white fill-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. FLOATING ACTION BUTTON (KHUSUS HALAMAN GALLERY) */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl shadow-blue-600/40 hover:bg-blue-500 transition active:scale-90 flex items-center gap-2">
          <FiImage size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Tambah Foto</span>
        </button>
      </div>

    </div>
  );
};

export default Gallery;