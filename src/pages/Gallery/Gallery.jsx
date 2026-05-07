import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient"; 
import heic2any from 'heic2any';
import { 
  FiArrowLeft, FiPlus, FiFolder, FiMoreVertical, 
  FiImage, FiHeart, FiX, FiSettings, FiArchive, 
  FiDownload, FiChevronLeft, FiChevronRight, 
  FiClock, FiUploadCloud, FiTrash2, FiEyeOff,
  FiFolderPlus, FiCamera, FiAperture
} from 'react-icons/fi';

const Gallery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // State Tabs & Filters
  const [activeTab, setActiveTab] = useState('Semua');
  const [sortOrder, setSortOrder] = useState(localStorage.getItem('gallery_sortOrder') || 'newest'); 
  const [gridSize, setGridSize] = useState(Number(localStorage.getItem('gallery_gridSize')) || 3); 
  
  // State Data
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
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

  // --- STATE KAMERA IN-APP ---
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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

  // Membersihkan Kamera jika komponen di-unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- LOGIKA KAMERA IN-APP ---
  const openCamera = async () => {
    try {
      setShowAddPhoto(false); // Tutup modal upload biasa
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Menggunakan kamera belakang (jika di HP)
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Kamera error:", err);
      alert("Tidak dapat mengakses kamera. Pastikan kamu telah mengizinkan akses kamera di browser.");
      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureAndUpload = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Menggambar frame video ke canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Mengubah canvas menjadi file dan langsung Upload
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `cam_${Date.now()}.jpg`, { type: 'image/jpeg' });
        closeCamera(); // Tutup kamera
        await uploadFileDirectly(file, selectedAlbum);// Proses upload otomatis
      }, 'image/jpeg', 0.8);
    }
  };

  const uploadFileDirectly = async (file, albumId = null) => {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
      const { error: uploadError } = await supabase.storage.from('gallery-bucket').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('gallery-bucket').getPublicUrl(fileName);

      const targetAlbum = albumId || null;
      const { data: insertData, error: dbError } = await supabase.from('photos').insert([
        { url: publicUrl, album_id: targetAlbum, is_archived: false, is_liked: false, is_deleted: false, is_hidden: false }
      ]).select();

      if (dbError) throw dbError;

      if (insertData && insertData.length > 0) {
         setPhotos([{
           id: insertData[0].id, url: insertData[0].url, album_id: insertData[0].album_id, isLiked: false, date: new Date()
         }, ...photos]);
      }
    } catch (error) {
      console.error("Gagal auto-upload:", error.message);
      alert("Gagal menyimpan foto hasil jepretan.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIKA ALBUM ---
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return alert("Nama album tidak boleh kosong!");
    try {
      const { data, error } = await supabase.from('albums').insert([{ name: newAlbumName }]).select();
      if (error) throw error;
      if (data) setAlbums([data[0], ...albums]);
      setShowAddAlbum(false);
      setNewAlbumName('');
    } catch (error) {
      console.error("Gagal membuat album:", error.message);
    }
  };

  // --- LOGIKA UPLOAD BIASA ---
  const handleFileSelect = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
      setIsUploading(true);
      try {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
        const newFileName = file.name.replace(/\.heic|\.heif/i, '.jpg');
        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        file = new File([finalBlob], newFileName, { type: "image/jpeg" });
      } catch (error) {
        alert("Gagal memproses foto HEIC.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (activeAlbum) setSelectedAlbum(activeAlbum.id);
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
    await uploadFileDirectly(selectedFile, selectedAlbum);
    closeUploadModal();
  };

  // --- LOGIKA AKSI FOTO ---
  const handleHidePhoto = async (id) => {
    try {
      await supabase.from('photos').update({ is_hidden: true }).eq('id', id);
      setPhotos(photos.filter(p => p.id !== id));
      setCurrentIndex(null);
    } catch (error) { console.error(error); }
  };

  const handleDeletePhoto = async (id) => {
    try {
      await supabase.from('photos').update({ is_deleted: true }).eq('id', id);
      setPhotos(photos.filter(p => p.id !== id));
      setCurrentIndex(null);
    } catch (error) { console.error(error); }
  };

  const toggleLike = async (id, e) => {
    if(e) e.stopPropagation();
    const photo = photos.find(p => p.id === id);
    try {
      await supabase.from('photos').update({ is_liked: !photo.isLiked }).eq('id', id);
      setPhotos(photos.map(p => p.id === id ? { ...p, isLiked: !p.isLiked } : p));
    } catch (error) { console.error(error); }
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
    } catch (error) { console.error(error); }
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
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndAction = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] pb-24 font-sans relative selection:bg-[#D85482]/30">
      
      {/* 1. HEADER (Lebih Elegan & Glassmorphism) */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-gray-100/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] hover:bg-gray-50 active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-[#2A4480]">Galeri Foto</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-widest">MyLove I&L Archive</p>
          </div>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2.5 rounded-full transition-all ${showMenu ? 'bg-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-[#2A4480]'}`}>
            <FiMoreVertical size={20} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                <button onClick={() => navigate('/gallery/pengaturan')} className="w-full px-5 py-3.5 text-left text-sm text-[#2A3A6A] font-bold hover:bg-gray-50 flex items-center gap-3 transition-colors">
                  <FiSettings className="text-[#D85482]" size={18} /> Pengaturan Galeri
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* OVERLAY LOADING UPLOAD OTOMATIS */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#D85482] mb-4"></div>
            <p className="text-[#2A4480] font-bold tracking-wide">Menyimpan Kenangan...</p>
          </div>
        </div>
      )}

      {/* 2. ALBUMS SECTION */}
      <section className="mt-8">
        <div className="flex justify-between items-center px-6 mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <FiFolder /> Album Kenangan
          </h2>
          <button onClick={() => setShowAddAlbum(true)} className="text-[10px] text-[#D85482] bg-[#D85482]/10 hover:bg-[#D85482]/20 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors active:scale-95 shadow-sm">
            <FiPlus size={12} strokeWidth={3} /> Buat Album
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 py-2 px-6 scrollbar-hide">
          {albums.map((album) => {
            const coverPhoto = photos.find(p => p.album_id === album.id);
            const isSelected = activeAlbum && activeAlbum.id === album.id;

            return (
              <div 
                key={album.id} 
                onClick={() => setActiveAlbum(isSelected ? null : album)} 
                className={`w-[100px] flex-shrink-0 group cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105 -translate-y-1' : 'hover:scale-105 active:scale-95'}`}
              >
                <div className={`relative aspect-[4/5] rounded-[1.25rem] overflow-hidden mb-3 shadow-md flex items-center justify-center transition-all ${isSelected ? 'ring-4 ring-[#D85482] shadow-xl shadow-[#D85482]/30' : 'bg-gradient-to-br from-[#2A4480] to-[#1f3360]'}`}>
                  {coverPhoto ? (
                    <img src={coverPhoto.url} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <FiFolder className="text-white/30 text-4xl" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-3 left-3 right-3">
                     <h3 className="text-xs font-bold text-white line-clamp-1 leading-tight drop-shadow-md">{album.name}</h3>
                     <p className="text-[9px] text-white/80 font-medium mt-0.5">{photos.filter(p => p.album_id === album.id).length} Foto</p>
                  </div>
                </div>
              </div>
            );
          })}
          {albums.length === 0 && (
             <div className="w-full text-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <p className="text-xs text-gray-400 font-medium">Belum ada album yang dibuat.</p>
             </div>
          )}
        </div>
      </section>

      {/* 3. TABS & GRID SECTION */}
      <section className="mt-8 px-6">
        <div className="flex flex-col gap-4 mb-6">
          {activeAlbum ? (
            <div className="flex justify-between items-end border-b border-gray-200 pb-3">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><FiFolder size={10}/> Isi Album</p>
                <h2 className="text-xl font-black text-[#D85482]">{activeAlbum.name}</h2>
              </div>
              <button onClick={() => setActiveAlbum(null)} className="text-[10px] uppercase tracking-widest bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold px-4 py-2 rounded-full transition active:scale-95">
                Tutup
              </button>
            </div>
          ) : (
            <div className="flex gap-6 border-b border-gray-200 pb-0">
              {['Semua', 'Favorit'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#2A4480]' : 'text-gray-400 hover:text-[#2A3A6A]/70'}`}>
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
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-5 rounded-full mb-4 shadow-inner">
              {activeAlbum ? <FiFolder className="text-gray-400" size={36}/> : <FiHeart size={36} className="text-gray-400" />}
            </div>
            <p className="text-[#2A3A6A] text-sm font-bold mb-1">
              {activeAlbum ? `Album Kosong` : 'Galeri Kosong'}
            </p>
            <p className="text-xs text-gray-400 font-medium">Ayo abadikan momen indah kalian.</p>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {filteredPhotos.map((photo, index) => (
              <div key={photo.id} onClick={() => setCurrentIndex(index)} className="relative aspect-square rounded-[1.25rem] overflow-hidden group cursor-pointer active:scale-95 transition-transform bg-gray-200 shadow-sm hover:shadow-md">
                <img src={photo.url} alt="Kenangan" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <button onClick={(e) => toggleLike(photo.id, e)} className="absolute bottom-2 right-2 p-1.5 z-10 hover:scale-110 transition-transform">
                  <FiHeart className={`transition-all ${photo.isLiked ? 'text-[#D85482] fill-[#D85482] drop-shadow-md' : 'text-white drop-shadow-sm'}`} size={gridSize >= 4 ? 14 : 20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. LIGHTBOX / FULLSCREEN (TIDAK BERUBAH) */}
      {currentIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[70] bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setCurrentIndex(null)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition backdrop-blur-md active:scale-90">
              <FiX size={24} />
            </button>
            <div className="flex gap-4 items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <span className="text-white/60 text-xs font-bold mr-2">{currentIndex + 1} / {filteredPhotos.length}</span>
              <button onClick={() => setShowMoveModal(true)} className="text-white hover:text-[#4A90E2] transition active:scale-90" title="Pindah Album"><FiFolderPlus size={20} /></button>
              <button onClick={() => handleHidePhoto(filteredPhotos[currentIndex].id)} className="text-white hover:text-yellow-400 transition active:scale-90" title="Sembunyikan"><FiEyeOff size={20} /></button>
              <button onClick={() => handleDeletePhoto(filteredPhotos[currentIndex].id)} className="text-white hover:text-red-500 transition active:scale-90" title="Hapus"><FiTrash2 size={20} /></button>
              <button onClick={(e) => toggleLike(filteredPhotos[currentIndex].id, e)} className="active:scale-75 transition-transform ml-1">
                <FiHeart size={22} className={filteredPhotos[currentIndex].isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-white'} />
              </button>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center relative touch-none" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndAction}>
            <button onClick={handlePrev} className="absolute left-6 p-4 bg-white/10 text-white rounded-full z-[70] hover:bg-white/20 hidden md:block backdrop-blur-md transition-colors"><FiChevronLeft size={28} /></button>
            <img src={filteredPhotos[currentIndex].url} alt="Fullscreen" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-all select-none" />
            <button onClick={handleNext} className="absolute right-6 p-4 bg-white/10 text-white rounded-full z-[70] hover:bg-white/20 hidden md:block backdrop-blur-md transition-colors"><FiChevronRight size={28} /></button>
          </div>

          {/* Modal Pindah Album */}
          {showMoveModal && (
            <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#2A3A6A]">Pindah Album</h3>
                  <button onClick={() => setShowMoveModal(false)} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-2 rounded-full"><FiX size={18}/></button>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pilih Album Tujuan</p>
                <select 
                  value={targetMoveAlbum} 
                  onChange={(e) => setTargetMoveAlbum(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-[#2A3A6A] font-bold focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] mb-6 transition appearance-none"
                >
                  <option value="">-- Keluarkan dari Album --</option>
                  {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <button onClick={handleMovePhoto} className="w-full bg-[#2A4480] text-white font-bold py-4 rounded-xl hover:bg-[#1f3360] transition shadow-lg shadow-[#2A4480]/30 active:scale-95 flex items-center justify-center gap-2">
                  <FiFolderPlus /> Pindahkan Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. FLOATING ACTION BUTTON (DIPERBARUI UNTUK KAMERA) */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
        {/* Tombol Buka Kamera (In-App) */}
        <button onClick={openCamera} className="bg-[#D85482] text-white p-4 rounded-full shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-[3px] border-white">
          <FiCamera size={24} />
        </button>
        {/* Tombol Upload Biasa */}
        <button onClick={() => setShowAddPhoto(true)} className="bg-[#2A4480] text-white p-4 rounded-full shadow-lg shadow-[#2A4480]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-[3px] border-white">
          <FiPlus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* --- UI KAMERA IN-APP (FULLSCREEN) --- */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
          {/* Header Kamera */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
             <button onClick={closeCamera} className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md active:scale-90 transition-all">
               <FiX size={24} />
             </button>
             <span className="text-white/80 text-xs font-bold uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
               Kamera MyLove
             </span>
          </div>

          {/* Viewfinder Video */}
          <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover"
             />
             {/* Grid Kamera (Estetika) */}
             <div className="absolute inset-0 pointer-events-none border border-white/10 flex flex-col">
               <div className="flex-1 border-b border-white/10"></div>
               <div className="flex-1 border-b border-white/10"></div>
               <div className="flex-1"></div>
               <div className="absolute inset-0 flex">
                 <div className="flex-1 border-r border-white/10"></div>
                 <div className="flex-1 border-r border-white/10"></div>
                 <div className="flex-1"></div>
               </div>
             </div>
             {/* Canvas Tersembunyi (Untuk Proses Capture) */}
             <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Kontrol Bawah Kamera */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-center z-10 pb-8">
            <button 
              onClick={captureAndUpload} 
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-90 transition-transform border-[4px] border-gray-300"
            >
              <FiAperture size={32} className="text-[#D85482]" />
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS TAMBAH ALBUM --- */}
      {showAddAlbum && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A] flex items-center gap-2">
                <FiFolder className="text-[#D85482]"/> Buat Album
              </h3>
              <button onClick={() => setShowAddAlbum(false)} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-2 rounded-full"><FiX size={18}/></button>
            </div>
            <input 
              type="text" 
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Nama Album (ex: Liburan Bali)" 
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-4 text-[#2A3A6A] font-bold focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] mb-6 transition" 
            />
            <button onClick={handleCreateAlbum} className="w-full bg-[#D85482] text-white font-bold py-4 rounded-xl hover:bg-[#c04770] transition shadow-lg shadow-[#D85482]/30 active:scale-95">
              Simpan Album
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS UPLOAD FOTO BIASA --- */}
      {showAddPhoto && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A] flex items-center gap-2">
                <FiImage className="text-[#2A4480]" /> Upload Foto
              </h3>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-2 rounded-full"><FiX size={18}/></button>
            </div>
            
            <div className="relative mb-6">
              <input type="file" accept="image/*,.heic,.heif" ref={fileInputRef} onChange={handleFileSelect} className="hidden" id="photo-upload" />
              {!previewUrl ? (
                <label htmlFor="photo-upload" className="border-2 border-dashed border-[#2A4480]/30 rounded-[1.5rem] p-8 flex flex-col items-center justify-center gap-3 bg-[#FAFAFA] cursor-pointer hover:bg-[#2A4480]/5 transition group h-52">
                  <div className="bg-[#2A4480]/10 p-4 rounded-full group-hover:scale-110 transition duration-300">
                    <FiUploadCloud size={36} className="text-[#2A4480]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#2A3A6A] font-bold mt-1">Pilih dari Galeri HP</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">JPG, PNG, HEIC</p>
                  </div>
                </label>
              ) : (
                <div className="relative h-52 rounded-[1.5rem] overflow-hidden border border-gray-200 shadow-inner group bg-gray-100">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button onClick={clearUpload} className="bg-red-500/90 text-white p-4 rounded-full hover:bg-red-600 transition shadow-lg active:scale-90">
                      <FiTrash2 size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Simpan Ke Album (Opsional)</p>
            <select 
              value={selectedAlbum} 
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-4 text-[#2A3A6A] font-bold focus:outline-none focus:border-[#2A4480] focus:ring-1 focus:ring-[#2A4480] mb-6 transition appearance-none"
            >
              <option value="">-- Tanpa Album --</option>
              {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <button onClick={handleUpload} disabled={isUploading || !selectedFile} className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${isUploading || !selectedFile ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#2A4480] hover:bg-[#1f3360] shadow-[#2A4480]/30 active:scale-95'}`}>
              {isUploading ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> Mengunggah...</> : 'Upload Sekarang'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;