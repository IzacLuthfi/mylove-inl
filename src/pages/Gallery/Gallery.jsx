import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient"; 
import heic2any from 'heic2any';
import { 
  FiArrowLeft, FiPlus, FiFolder, FiMoreVertical, 
  FiImage, FiHeart, FiX, FiSettings, FiArchive, 
  FiDownload, FiChevronLeft, FiChevronRight, 
  FiClock, FiUploadCloud, FiTrash2, FiEyeOff,
  FiFolderPlus
} from 'react-icons/fi';

const Gallery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // State Tabs & Filters (Baca dari LocalStorage agar sinkron dengan Pengaturan)
  const [activeTab, setActiveTab] = useState('Semua');
  const [sortOrder, setSortOrder] = useState(localStorage.getItem('gallery_sortOrder') || 'newest'); 
  const [gridSize, setGridSize] = useState(Number(localStorage.getItem('gallery_gridSize')) || 3); 
  
  // State Data
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  // State Album Aktif (Untuk membuka folder)
  const [activeAlbum, setActiveAlbum] = useState(null);

  // State Modals
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false); 
  const [newAlbumName, setNewAlbumName] = useState('');
  const [targetMoveAlbum, setTargetMoveAlbum] = useState('');

  // State Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const fileInputRef = useRef(null);

  // State Lightbox
  const [currentIndex, setCurrentIndex] = useState(null); 
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch Data (Photos & Albums)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: albumData, error: albumError } = await supabase
          .from('albums')
          .select('*')
          .order('created_at', { ascending: false });
        if (albumError) throw albumError;
        setAlbums(albumData || []);

        const { data: photoData, error: photoError } = await supabase
          .from('photos')
          .select('*')
          .eq('is_archived', false)
          .eq('is_deleted', false)
          .eq('is_hidden', false)
          .order('created_at', { ascending: false });
        if (photoError) throw photoError;
        
        if (photoData) {
          const formattedPhotos = photoData.map(item => ({
            id: item.id,
            url: item.url,
            album_id: item.album_id, 
            isLiked: item.is_liked || false,
            date: new Date(item.created_at)
          }));
          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setGridSize(Number(localStorage.getItem('gallery_gridSize')) || 3);
    setSortOrder(localStorage.getItem('gallery_sortOrder') || 'newest');
  }, []);

  // --- LOGIKA ALBUM ---
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return alert("Nama album tidak boleh kosong!");
    try {
      const { data, error } = await supabase
        .from('albums')
        .insert([{ name: newAlbumName }])
        .select();
      if (error) throw error;
      if (data) setAlbums([data[0], ...albums]);
      setShowAddAlbum(false);
      setNewAlbumName('');
    } catch (error) {
      console.error("Gagal membuat album:", error.message);
      alert("Gagal membuat album.");
    }
  };

  // --- LOGIKA UPLOAD ---
  const handleFileSelect = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
      setIsUploading(true);
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8 
        });
        const newFileName = file.name.replace(/\.heic|\.heif/i, '.jpg');
        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        file = new File([finalBlob], newFileName, { type: "image/jpeg" });
      } catch (error) {
        console.error("Gagal convert HEIC:", error);
        alert("Gagal memproses foto HEIC.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    if (activeAlbum) {
      setSelectedAlbum(activeAlbum.id);
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
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-bucket') 
        .upload(filePath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-bucket')
        .getPublicUrl(filePath);

      const { data: insertData, error: dbError } = await supabase.from('photos').insert([
        { 
          url: publicUrl, 
          album_id: selectedAlbum || null, 
          is_archived: false,
          is_liked: false,
          is_deleted: false,
          is_hidden: false
        }
      ]).select();

      if (dbError) throw dbError;

      if (insertData && insertData.length > 0) {
         const newPhoto = {
           id: insertData[0].id,
           url: insertData[0].url,
           album_id: insertData[0].album_id,
           isLiked: false,
           date: new Date()
         };
         setPhotos([newPhoto, ...photos]);
      }
      closeUploadModal();
    } catch (error) {
      console.error("Gagal mengupload:", error.message);
      alert("Gagal mengunggah foto. Pastikan pengaturan Supabase sudah benar.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIKA AKSI FOTO ---
  const handleHidePhoto = async (id) => {
    try {
      await supabase.from('photos').update({ is_hidden: true }).eq('id', id);
      setPhotos(photos.filter(p => p.id !== id));
      setCurrentIndex(null);
    } catch (error) {
      console.error("Error hiding photo:", error);
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      await supabase.from('photos').update({ is_deleted: true }).eq('id', id);
      setPhotos(photos.filter(p => p.id !== id));
      setCurrentIndex(null);
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const toggleLike = async (id, e) => {
    if(e) e.stopPropagation();
    const photo = photos.find(p => p.id === id);
    try {
      await supabase.from('photos').update({ is_liked: !photo.isLiked }).eq('id', id);
      setPhotos(photos.map(p => p.id === id ? { ...p, isLiked: !p.isLiked } : p));
    } catch (error) {
      console.error("Error liking photo:", error);
    }
  };

  const handleMovePhoto = async () => {
    if (currentIndex === null) return;
    const currentPhotoId = filteredPhotos[currentIndex].id;
    const targetAlbumId = targetMoveAlbum === "" ? null : targetMoveAlbum; 

    try {
      await supabase.from('photos').update({ album_id: targetAlbumId }).eq('id', currentPhotoId);
      setPhotos(photos.map(p => p.id === currentPhotoId ? { ...p, album_id: targetAlbumId } : p));
      setShowMoveModal(false);
      setCurrentIndex(null); 
    } catch (error) {
      console.error("Gagal memindah album:", error.message);
    }
  };

  // --- FILTERING & SORTING ---
  let filteredPhotos = [...photos];
  
  if (activeAlbum) {
    filteredPhotos = filteredPhotos.filter(p => p.album_id === activeAlbum.id);
  } else if (activeTab === 'Favorit') {
    filteredPhotos = filteredPhotos.filter(p => p.isLiked);
  }

  if (sortOrder === 'newest') {
    filteredPhotos.sort((a, b) => b.date - a.date);
  } else {
    filteredPhotos.sort((a, b) => a.date - b.date);
  }

  // --- LIGHTBOX SWIPE ---
  const handlePrev = () => setCurrentIndex(prev => prev === 0 ? filteredPhotos.length - 1 : prev - 1);
  const handleNext = () => setCurrentIndex(prev => prev === filteredPhotos.length - 1 ? 0 : prev + 1);

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
      
      {/* 1. HEADER */}
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
                <button onClick={() => navigate('/gallery/pengaturan')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
                  <FiSettings className="text-gray-400" /> Pengaturan Galeri
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. ALBUMS SECTION (Diperbarui agar tidak kepotong kiri) */}
      <section className="mt-6">
        {/* Padding (px-6) dipindah ke bagian teks judul agar tetap sejajar */}
        <div className="flex justify-between items-center px-6 mb-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Album Kenangan</h2>
          <button onClick={() => setShowAddAlbum(true)} className="text-[11px] text-[#D85482] bg-[#D85482]/10 hover:bg-[#D85482]/20 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-colors active:scale-95">
            <FiPlus size={12} strokeWidth={3} /> Baru
          </button>
        </div>

        {/* Padding horizontal (px-6) dipindah ke dalam area scroll agar ujung kiri punya ruang napas dan tidak terpotong saat membesar */}
        <div className="flex overflow-x-auto gap-4 py-4 px-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {albums.map((album) => {
            const coverPhoto = photos.find(p => p.album_id === album.id);
            const isSelected = activeAlbum && activeAlbum.id === album.id;

            return (
              <div 
                key={album.id} 
                onClick={() => setActiveAlbum(isSelected ? null : album)} 
                className={`w-[95px] flex-shrink-0 group cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105 -translate-y-1' : 'hover:scale-105 active:scale-95'}`}
              >
                <div className={`relative aspect-square rounded-2xl overflow-hidden mb-2.5 shadow-sm flex items-center justify-center transition-all ${isSelected ? 'ring-4 ring-[#D85482]/80 shadow-md' : 'bg-[#2A4480]'}`}>
                  {coverPhoto ? (
                    <img src={coverPhoto.url} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <FiFolder className="text-white/50 text-3xl" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A4480]/90 via-[#2A4480]/20 to-transparent"></div>
                  
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/30 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                    <FiImage className="text-white text-[9px]" />
                    <span className="text-[9px] text-white font-bold">{photos.filter(p => p.album_id === album.id).length}</span>
                  </div>
                </div>
                <h3 className={`text-xs font-bold px-1 truncate ${isSelected ? 'text-[#D85482]' : 'text-[#2A3A6A]'}`}>{album.name}</h3>
              </div>
            );
          })}
          {albums.length === 0 && (
             <p className="text-xs text-gray-400 italic mt-3">Belum ada album.</p>
          )}
        </div>
      </section>

      {/* 3. TABS / HEADER ALBUM AKTIF & GRID */}
      <section className="mt-4 px-6">
        <div className="flex flex-col gap-4 mb-6">
          {activeAlbum ? (
            <div className="flex justify-between items-end border-b border-gray-200 pb-3">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Menampilkan Isi Album</p>
                <h2 className="text-lg font-bold text-[#D85482]">{activeAlbum.name}</h2>
              </div>
              <button onClick={() => setActiveAlbum(null)} className="text-xs bg-gray-100 hover:bg-gray-200 text-[#2A3A6A] font-bold px-4 py-2 rounded-full transition active:scale-95">
                Tutup Album
              </button>
            </div>
          ) : (
            <div className="flex gap-6 border-b border-gray-200 pb-0">
              {['Semua', 'Favorit'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#2A3A6A]' : 'text-gray-400 hover:text-[#2A3A6A]/70'}`}>
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D85482] rounded-t-full"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D85482]"></div></div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              {activeAlbum ? <FiFolder className="text-gray-400" size={32}/> : <FiHeart size={32} className="text-gray-400" />}
            </div>
            <p className="text-gray-500 text-sm font-medium">
              {activeAlbum ? `Album "${activeAlbum.name}" masih kosong.` : 'Belum ada foto.'}
            </p>
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

      {/* 4. LIGHTBOX / FULLSCREEN */}
      {currentIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[70] bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setCurrentIndex(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
              <FiX size={24} />
            </button>
            <div className="flex gap-4 items-center">
              <span className="text-white/50 text-xs font-bold mr-2">{currentIndex + 1} / {filteredPhotos.length}</span>
              
              <button onClick={() => setShowMoveModal(true)} className="text-white/80 hover:text-blue-400 transition" title="Pindah Album">
                <FiFolderPlus size={22} />
              </button>
              <button onClick={() => handleHidePhoto(filteredPhotos[currentIndex].id)} className="text-white/80 hover:text-[#D85482] transition" title="Sembunyikan">
                <FiEyeOff size={22} />
              </button>
              <button onClick={() => handleDeletePhoto(filteredPhotos[currentIndex].id)} className="text-white/80 hover:text-red-400 transition" title="Hapus">
                <FiTrash2 size={22} />
              </button>
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
          
          {showMoveModal && (
            <div className="absolute inset-0 z-[80] bg-black/60 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#2A3A6A]">Pindah Album</h3>
                  <button onClick={() => setShowMoveModal(false)} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-1.5 rounded-full"><FiX size={20}/></button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">Pilih album tujuan untuk foto ini:</p>
                <select 
                  value={targetMoveAlbum} 
                  onChange={(e) => setTargetMoveAlbum(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] mb-6 transition appearance-none"
                >
                  <option value="">-- Keluarkan dari Album (Tanpa Album) --</option>
                  {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>

                <button onClick={handleMovePhoto} className="w-full bg-[#2A4480] text-white font-bold py-3.5 rounded-xl hover:bg-[#1f3360] transition shadow-md active:scale-95 flex items-center justify-center gap-2">
                  <FiFolderPlus /> Pindahkan Sekarang
                </button>
              </div>
            </div>
          )}

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
            <input 
              type="text" 
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Nama Album (ex: Liburan Bali)" 
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] mb-6 transition" 
            />
            <button onClick={handleCreateAlbum} className="w-full bg-[#D85482] text-white font-bold py-3.5 rounded-xl hover:bg-[#c04770] transition shadow-md active:scale-95">
              Simpan Album
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS TAMBAH FOTO --- */}
      {showAddPhoto && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A]">Upload Kenangan</h3>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-1.5 rounded-full"><FiX size={20}/></button>
            </div>
            
            <div className="relative mb-6">
              <input type="file" accept="image/*,.heic,.heif" ref={fileInputRef} onChange={handleFileSelect} className="hidden" id="photo-upload" />
              {!previewUrl ? (
                <label htmlFor="photo-upload" className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#FAFAFA] cursor-pointer hover:bg-gray-50 transition group h-48">
                  <div className="bg-[#D85482]/10 p-3 rounded-full group-hover:scale-110 transition">
                    <FiUploadCloud size={32} className="text-[#D85482]" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium text-center mt-2">Ketuk untuk memilih foto dari perangkat.</p>
                </label>
              ) : (
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
              <option value="">-- Tanpa Album --</option>
              {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <button onClick={handleUpload} disabled={isUploading} className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-md active:scale-95 flex items-center justify-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A4480] hover:bg-[#1f3360]'}`}>
              {isUploading ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>Mengunggah...</> : 'Upload Sekarang'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;