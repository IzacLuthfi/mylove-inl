import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from "@/config/supabaseClient"; 
import { 
  FiArrowLeft, FiPlus, FiFolder, FiMoreVertical, 
  FiImage, FiHeart, FiX, FiSettings, FiArchive, 
  FiDownload, FiChevronLeft, FiChevronRight, 
  FiClock, FiGrid, FiUploadCloud
} from 'react-icons/fi';

const Gallery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // State Tabs & Filters
  const [activeTab, setActiveTab] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [gridSize, setGridSize] = useState(3); // 2, 3, 4 kolom
  
  // State untuk Data
  const [photos, setPhotos] = useState([]);
  
  // State untuk Modals (Pop-up Tambah)
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  // State untuk Lightbox & Swipe Logic
  const [currentIndex, setCurrentIndex] = useState(null); 
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Simulasi Data Album
  const dummyAlbums = [
    { id: 1, name: 'Our First Date', count: 12, cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format' },
    { id: 2, name: 'Liburan Sama Sekar', count: 42, cover: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&auto=format' },
    { id: 3, name: 'Random Moments', count: 128, cover: 'https://images.unsplash.com/photo-1516589174184-c68d8e5f0b4a?w=500&auto=format' },
  ];

  useEffect(() => {
    // Simulasi Fetch Data dengan tanggal untuk fitur sorting
    const fetchPhotos = () => {
      const dummyPhotos = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        url: `https://picsum.photos/seed/${i + 50}/600/600`,
        isLiked: i % 3 === 0, 
        date: new Date(Date.now() - Math.random() * 10000000000), // Random date
      }));
      setPhotos(dummyPhotos);
      setLoading(false);
    };
    setTimeout(fetchPhotos, 1000);
  }, []);

  // --- LOGIKA FILTER & SORTING ---
  let filteredPhotos = activeTab === 'Favorit' ? photos.filter(p => p.isLiked) : [...photos];
  
  if (sortOrder === 'newest') {
    filteredPhotos.sort((a, b) => b.date - a.date);
  } else {
    filteredPhotos.sort((a, b) => a.date - b.date);
  }

  // --- LOGIKA LIKE ---
  const toggleLike = (id, e) => {
    if(e) e.stopPropagation();
    setPhotos(photos.map(p => p.id === id ? { ...p, isLiked: !p.isLiked } : p));
  };

  // --- LOGIKA LIGHTBOX SWIPE (GESER-GESER) ---
  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? filteredPhotos.length - 1 : prev - 1);
  };
  const handleNext = () => {
    setCurrentIndex(prev => prev === filteredPhotos.length - 1 ? 0 : prev + 1);
  };

  // Handler sentuhan untuk HP
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndAction = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext(); // Geser ke kiri = foto selanjutnya
    if (isRightSwipe) handlePrev(); // Geser ke kanan = foto sebelumnya
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24 font-sans selection:bg-pink-500/30 relative">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Galeri Foto</h1>
            <p className="text-[10px] text-pink-400 font-medium">MyLove I&L Archive</p>
          </div>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition-all ${showMenu ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
            <FiMoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] rounded-2xl shadow-xl border border-white/10 overflow-hidden z-50 py-2 animate-fade-in">
                <button onClick={() => navigate('/gallery/arsip')} className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/5 flex items-center gap-3">
                  <FiArchive className="text-gray-400" /> Arsip Foto
                </button>
                <button onClick={() => navigate('/gallery/pengaturan')} className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/5 flex items-center gap-3">
                  <FiSettings className="text-gray-400" /> Pengaturan Galeri
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. ALBUMS SECTION */}
      <section className="mt-6 pl-6">
        <div className="flex justify-between items-center pr-6 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Album Kenangan</h2>
          <button 
            onClick={() => setShowAddAlbum(true)}
            className="text-xs text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 transition-colors active:scale-95"
          >
            <FiPlus size={14} /> Baru
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {dummyAlbums.map((album) => (
            <div key={album.id} className="min-w-[140px] group cursor-pointer active:scale-95 transition-transform duration-300">
              <div className="relative aspect-square rounded-3xl overflow-hidden mb-3 shadow-lg border border-white/5 bg-white/5">
                <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg inline-block mb-2">
                    <FiFolder className="text-white text-xs" />
                  </div>
                  <p className="text-[10px] font-medium text-pink-300">{album.count} Foto</p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-200 px-1 truncate">{album.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TABS & QUICK FILTERS */}
      <section className="mt-8 px-6">
        <div className="flex flex-col gap-4 mb-6">
          {/* Tabs */}
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex gap-4">
              {['Semua', 'Favorit'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-t-full"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Filter Waktu & Ukuran */}
          <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
            <button 
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-2 py-1"
            >
              <FiClock /> {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
            </button>
            <div className="flex items-center gap-3 px-2 border-l border-white/10">
              <span className="text-xs text-gray-500">Grid:</span>
              {[2, 3, 4].map(size => (
                <button 
                  key={size} onClick={() => setGridSize(size)}
                  className={`text-xs ${gridSize === size ? 'text-pink-400 font-bold' : 'text-gray-500'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* RECENT PHOTOS GRID */}
        {loading ? (
          <div className={`grid grid-cols-${gridSize} gap-2`}>
            {[...Array(9)].map((_, i) => <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center opacity-50">
            <FiHeart size={40} className="text-gray-500 mb-4" />
            <p className="text-gray-400 text-sm">Belum ada foto.</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {filteredPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                onClick={() => setCurrentIndex(index)}
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group cursor-pointer active:scale-95 transition-transform"
              >
                <img src={photo.url} alt="Kenangan" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <button 
                  onClick={(e) => toggleLike(photo.id, e)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full z-10"
                >
                  <FiHeart className={`transition-all ${photo.isLiked ? 'text-pink-500 fill-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]' : 'text-white/70'}`} size={gridSize === 4 ? 12 : 16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. LIGHTBOX / SLIDER FULLSCREEN */}
      {currentIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[70] bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setCurrentIndex(null)} className="p-2 bg-white/10 rounded-full text-white">
              <FiX size={24} />
            </button>
            <div className="flex gap-5 items-center">
              <span className="text-white/50 text-xs font-medium mr-2">
                {currentIndex + 1} / {filteredPhotos.length}
              </span>
              <button className="text-white/70 hover:text-white"><FiDownload size={22} /></button>
              <button onClick={(e) => toggleLike(filteredPhotos[currentIndex].id, e)} className="active:scale-75 transition-transform">
                <FiHeart size={24} className={filteredPhotos[currentIndex].isLiked ? 'text-pink-500 fill-pink-500' : 'text-white'} />
              </button>
            </div>
          </div>

          {/* Swipeable Image Container */}
          <div 
            className="w-full h-full flex items-center justify-center relative touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndAction}
          >
            <button onClick={handlePrev} className="absolute left-4 p-3 bg-black/50 text-white rounded-full z-[70] hover:bg-black/80 hidden md:block">
              <FiChevronLeft size={24} />
            </button>
            
            <img 
              src={filteredPhotos[currentIndex].url} 
              alt="Fullscreen" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all select-none"
            />

            <button onClick={handleNext} className="absolute right-4 p-3 bg-black/50 text-white rounded-full z-[70] hover:bg-black/80 hidden md:block">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* 5. FLOATING ACTION BUTTON (Tambah Foto) */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setShowAddPhoto(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-[1.25rem] shadow-xl shadow-blue-900/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 border border-white/10"
        >
          <FiImage size={22} />
          <span className="text-xs font-bold uppercase tracking-wider pr-1">Tambah</span>
        </button>
      </div>

      {/* --- MODALS (POP-UP) --- */}
      
      {/* Modal Tambah Album */}
      {showAddAlbum && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#1E293B] w-full max-w-sm rounded-[2rem] p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Buat Album Baru</h3>
              <button onClick={() => setShowAddAlbum(false)} className="text-gray-400 hover:text-white"><FiX size={20}/></button>
            </div>
            <input type="text" placeholder="Nama Album (ex: Liburan Bali)" className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 mb-4" />
            <button 
              onClick={() => setShowAddAlbum(false)} // Nanti diganti fungsi save Supabase
              className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition active:scale-95"
            >
              Simpan Album
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah Foto */}
      {showAddPhoto && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-[#1E293B] w-full max-w-sm rounded-t-[2rem] sm:rounded-[2rem] p-6 border-t sm:border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Upload Kenangan</h3>
              <button onClick={() => setShowAddPhoto(false)} className="text-gray-400 hover:text-white"><FiX size={20}/></button>
            </div>
            
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 mb-6 bg-white/5 cursor-pointer hover:bg-white/10 transition">
              <FiUploadCloud size={40} className="text-pink-400" />
              <p className="text-sm text-gray-400 text-center">Pilih foto dari galeri HP atau tarik file ke sini.</p>
            </div>

            <select className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 mb-4">
              <option value="">Pilih Album (Opsional)</option>
              {dummyAlbums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <button 
              onClick={() => setShowAddPhoto(false)} // Nanti diganti upload Supabase
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition active:scale-95"
            >
              Upload Sekarang
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;