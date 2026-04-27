import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from "@/config/supabaseClient"; 
import { 
  FiArrowLeft, FiPlus, FiFolder, FiMoreVertical, 
  FiImage, FiHeart, FiX, FiSettings, FiArchive, 
  FiDownload, FiChevronLeft, FiChevronRight, 
  FiClock, FiUploadCloud, FiTrash2
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

  // --- STATE KHUSUS UPLOAD FOTO ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const fileInputRef = useRef(null);

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
    // Simulasi Fetch Data
    const fetchPhotos = () => {
      const dummyPhotos = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        url: `https://picsum.photos/seed/${i + 50}/600/600`,
        isLiked: i % 3 === 0, 
        date: new Date(Date.now() - Math.random() * 10000000000), 
      }));
      setPhotos(dummyPhotos);
      setLoading(false);
    };
    setTimeout(fetchPhotos, 1000);
  }, []);

  // --- LOGIKA UPLOAD FOTO ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Membuat URL lokal sementara untuk preview gambar
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeUploadModal = () => {
    setShowAddPhoto(false);
    clearUpload();
    setSelectedAlbum('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Pilih foto terlebih dahulu ya!');
    setIsUploading(true);

    try {
      // --- LOGIKA SUPABASE (Buka komentar ini kalau database sudah siap) ---
      /*
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // Upload ke Storage
      const { error: uploadError } = await supabase.storage
        .from('gallery-bucket') // Ganti dengan nama bucket kamu
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Ambil URL public
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-bucket')
        .getPublicUrl(filePath);

      // Simpan ke tabel database (misal tabel 'photos')
      const { error: dbError } = await supabase.from('photos').insert([
        { url: publicUrl, album_id: selectedAlbum }
      ]);
      if (dbError) throw dbError;
      */

      // --- SIMULASI UI ---
      // Agar foto langsung muncul di layar (bahkan tanpa database)
      setTimeout(() => {
        const newPhoto = {
          id: Date.now(),
          url: previewUrl, // Pakai preview URL sebagai simulasi
          isLiked: false,
          date: new Date()
        };
        setPhotos([newPhoto, ...photos]); // Taruh foto baru di urutan pertama
        setIsUploading(false);
        closeUploadModal();
      }, 1500); // Simulasi loading 1.5 detik

    } catch (error) {
      console.error("Gagal mengupload:", error.message);
      setIsUploading(false);
      alert("Gagal mengunggah foto. Coba lagi.");
    }
  };

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

  // --- LOGIKA LIGHTBOX SWIPE ---
  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? filteredPhotos.length - 1 : prev - 1);
  };
  const handleNext = () => {
    setCurrentIndex(prev => prev === filteredPhotos.length - 1 ? 0 : prev + 1);
  };

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndAction = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] pb-24 font-sans relative selection:bg-[#D85482]/30">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Galeri Foto</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">MyLove I&L Archive</p>
          </div>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition-all ${showMenu ? 'bg-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}>
            <FiMoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                <button onClick={() => navigate('/gallery/arsip')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
                  <FiArchive className="text-gray-400" /> Arsip Foto
                </button>
                <button onClick={() => navigate('/gallery/pengaturan')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Album Kenangan</h2>
          <button onClick={() => setShowAddAlbum(true)} className="text-xs text-[#D85482] bg-[#D85482]/10 hover:bg-[#D85482]/20 px-4 py-1.5 rounded-full font-bold flex items-center gap-1 transition-colors active:scale-95">
            <FiPlus size={14} strokeWidth={3} /> Baru
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {dummyAlbums.map((album) => (
            <div key={album.id} className="min-w-[150px] group cursor-pointer active:scale-95 transition-transform duration-300">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-3 shadow-md bg-gray-200">
                <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A4480]/90 via-[#2A4480]/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/30 backdrop-blur-md p-2 rounded-xl inline-block mb-2 shadow-sm">
                    <FiFolder className="text-white text-sm" />
                  </div>
                  <p className="text-[10px] font-bold text-[#FAFAFA]">{album.count} Foto</p>
                </div>
              </div>
              <h3 className="text-sm font-bold text-[#2A3A6A] px-1 truncate">{album.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TABS & QUICK FILTERS */}
      <section className="mt-8 px-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-6 border-b border-gray-200 pb-0">
            {['Semua', 'Favorit'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#2A3A6A]' : 'text-gray-400 hover:text-[#2A3A6A]/70'}`}>
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D85482] rounded-t-full"></span>}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
            <button onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#2A3A6A] px-2 py-1">
              <FiClock /> {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
            </button>
            <div className="flex items-center gap-3 px-3 border-l border-gray-200">
              <span className="text-xs font-medium text-gray-400">Grid:</span>
              {[2, 3, 4].map(size => (
                <button key={size} onClick={() => setGridSize(size)} className={`text-xs transition-colors ${gridSize === size ? 'text-[#D85482] font-bold' : 'text-gray-400 font-medium hover:text-[#2A3A6A]'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* RECENT PHOTOS GRID */}
        {loading ? (
          <div className={`grid grid-cols-${gridSize} gap-2`}>
            {[...Array(9)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FiHeart size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Belum ada foto.</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {filteredPhotos.map((photo, index) => (
              <div key={photo.id} onClick={() => setCurrentIndex(index)} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer active:scale-95 transition-transform bg-gray-100">
                <img src={photo.url} alt="Kenangan" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <button onClick={(e) => toggleLike(photo.id, e)} className="absolute bottom-2 right-2 p-1.5 rounded-full z-10">
                  <FiHeart className={`transition-all ${photo.isLiked ? 'text-[#D85482] fill-[#D85482] drop-shadow-md' : 'text-white'}`} size={gridSize === 4 ? 14 : 18} />
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
            <button onClick={() => setCurrentIndex(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
              <FiX size={24} />
            </button>
            <div className="flex gap-5 items-center">
              <span className="text-white/50 text-xs font-bold mr-2">{currentIndex + 1} / {filteredPhotos.length}</span>
              <button className="text-white/80 hover:text-white transition"><FiDownload size={22} /></button>
              <button onClick={(e) => toggleLike(filteredPhotos[currentIndex].id, e)} className="active:scale-75 transition-transform">
                <FiHeart size={24} className={filteredPhotos[currentIndex].isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-white'} />
              </button>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center relative touch-none" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndAction}>
            <button onClick={handlePrev} className="absolute left-4 p-3 bg-white/10 text-white rounded-full z-[70] hover:bg-white/20 hidden md:block backdrop-blur-md">
              <FiChevronLeft size={24} />
            </button>
            <img src={filteredPhotos[currentIndex].url} alt="Fullscreen" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all select-none" />
            <button onClick={handleNext} className="absolute right-4 p-3 bg-white/10 text-white rounded-full z-[70] hover:bg-white/20 hidden md:block backdrop-blur-md">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* 5. FLOATING ACTION BUTTON */}
      <div className="fixed bottom-24 right-6 z-40">
        <button onClick={() => setShowAddPhoto(true)} className="bg-[#2A4480] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#2A4480]/30 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2">
          <FiImage size={22} />
          <span className="text-xs font-bold uppercase tracking-wider pr-1">Tambah</span>
        </button>
      </div>

      {/* --- MODALS TAMBAH ALBUM --- */}
      {showAddAlbum && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A]">Buat Album Baru</h3>
              <button onClick={() => setShowAddAlbum(false)} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-1.5 rounded-full"><FiX size={20}/></button>
            </div>
            <input type="text" placeholder="Nama Album (ex: Liburan Bali)" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] mb-6 transition" />
            <button onClick={() => setShowAddAlbum(false)} className="w-full bg-[#D85482] text-white font-bold py-3.5 rounded-xl hover:bg-[#c04770] transition shadow-md active:scale-95">
              Simpan Album
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS TAMBAH FOTO (SUDAH AKTIF) --- */}
      {showAddPhoto && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A]">Upload Kenangan</h3>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-1.5 rounded-full"><FiX size={20}/></button>
            </div>
            
            {/* Area Upload & Preview */}
            <div className="relative mb-6">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden" 
                id="photo-upload"
              />
              
              {!previewUrl ? (
                // Tampilan jika belum memilih foto
                <label htmlFor="photo-upload" className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#FAFAFA] cursor-pointer hover:bg-gray-50 transition group h-48">
                  <div className="bg-[#D85482]/10 p-3 rounded-full group-hover:scale-110 transition">
                    <FiUploadCloud size={32} className="text-[#D85482]" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium text-center mt-2">Ketuk untuk memilih foto dari galeri HP.</p>
                </label>
              ) : (
                // Tampilan Preview Foto yang Dipilih
                <div className="relative h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={clearUpload} className="bg-red-500/80 text-white p-3 rounded-full backdrop-blur-md hover:bg-red-600 transition">
                      <FiTrash2 size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <select 
              value={selectedAlbum} 
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] mb-6 transition appearance-none"
            >
              <option value="">Pilih Album (Opsional)</option>
              {dummyAlbums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-md active:scale-95 flex items-center justify-center gap-2
                ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A4480] hover:bg-[#1f3360]'}`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Mengunggah...
                </>
              ) : 'Upload Sekarang'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;