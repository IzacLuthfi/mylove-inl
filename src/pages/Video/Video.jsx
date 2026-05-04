import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlay, FiVideo, FiMoreVertical,
  FiClock, FiHeart, FiFilm, FiX, FiSettings,
  FiUploadCloud, FiTrash2, FiEyeOff, FiArchive
} from 'react-icons/fi';

const Video = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // State Pengaturan (Sinkron dengan LocalStorage)
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortOrder, setSortOrder] = useState(localStorage.getItem('video_sortOrder') || 'newest'); 
  const [gridSize, setGridSize] = useState(Number(localStorage.getItem('video_gridSize')) || 2); 
  
  // State Data
  const [videos, setVideos] = useState([]);
  
  // DITAMBAHKAN: 'Favorit' ke dalam daftar kategori
  const categories = ['Semua', 'Favorit', 'Vlog Liburan', 'Kejutan', 'Random TikTok', 'Deep Talks', 'Lainnya'];

  // State Upload
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Lainnya');
  const fileInputRef = useRef(null);

  // State Pemutar Video (Fullscreen)
  const [currentVideo, setCurrentVideo] = useState(null); 

  // Fetch Data dari Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('is_archived', false)
          .eq('is_deleted', false)
          .eq('is_hidden', false)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const formattedVideos = data.map(item => ({
            id: item.id,
            url: item.url,
            title: item.title,
            category: item.category,
            isLiked: item.is_liked || false,
            date: new Date(item.created_at)
          }));
          setVideos(formattedVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Sync Pengaturan
  useEffect(() => {
    setGridSize(Number(localStorage.getItem('video_gridSize')) || 2);
    setSortOrder(localStorage.getItem('video_sortOrder') || 'newest');
  }, []);

  // --- LOGIKA UPLOAD ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setVideoTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Pilih video terlebih dahulu!');
    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `vid_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('video-bucket') 
        .upload(fileName, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('video-bucket')
        .getPublicUrl(fileName);

      const { data: insertData, error: dbError } = await supabase.from('videos').insert([
        { 
          url: publicUrl, 
          title: videoTitle || 'Tanpa Judul',
          category: selectedCategory,
          is_archived: false,
          is_liked: false,
          is_deleted: false,
          is_hidden: false
        }
      ]).select();

      if (dbError) throw dbError;

      if (insertData && insertData.length > 0) {
         const newVideo = {
           id: insertData[0].id,
           url: insertData[0].url,
           title: insertData[0].title,
           category: insertData[0].category,
           isLiked: false,
           date: new Date()
         };
         setVideos([newVideo, ...videos]);
      }
      setShowAddVideo(false);
      clearUpload();
    } catch (error) {
      console.error("Gagal mengupload:", error.message);
      alert("Gagal mengunggah video.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIKA AKSI VIDEO ---
  const handleArchiveVideo = async (id) => {
    try {
      await supabase.from('videos').update({ is_archived: true }).eq('id', id);
      setVideos(videos.filter(v => v.id !== id));
      setCurrentVideo(null);
    } catch (error) { console.error("Error archiving:", error); }
  };

  const handleHideVideo = async (id) => {
    try {
      await supabase.from('videos').update({ is_hidden: true }).eq('id', id);
      setVideos(videos.filter(v => v.id !== id));
      setCurrentVideo(null);
    } catch (error) { console.error("Error hiding:", error); }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await supabase.from('videos').update({ is_deleted: true }).eq('id', id);
      setVideos(videos.filter(v => v.id !== id));
      setCurrentVideo(null);
    } catch (error) { console.error("Error deleting:", error); }
  };

  const toggleLike = async (id, e) => {
    if(e) e.stopPropagation();
    const video = videos.find(v => v.id === id);
    try {
      await supabase.from('videos').update({ is_liked: !video.isLiked }).eq('id', id);
      setVideos(videos.map(v => v.id === id ? { ...v, isLiked: !v.isLiked } : v));
    } catch (error) { console.error("Error liking:", error); }
  };

  // --- FILTERING & SORTING (DIPERBARUI UNTUK FAVORIT) ---
  let filteredVideos = [...videos];

  if (activeCategory === 'Favorit') {
    filteredVideos = filteredVideos.filter(v => v.isLiked);
  } else if (activeCategory !== 'Semua') {
    filteredVideos = filteredVideos.filter(v => v.category === activeCategory);
  }
  
  if (sortOrder === 'newest') {
    filteredVideos.sort((a, b) => b.date - a.date);
  } else {
    filteredVideos.sort((a, b) => a.date - b.date);
  }

  // Sorotan Utama (Video Terbaru yang di-like, atau video pertama)
  const featuredVideo = videos.find(v => v.isLiked) || videos[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 font-sans text-[#2A3A6A] selection:bg-[#D85482]/30">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Galeri Video</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">MyLove I&L Cinema</p>
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
                <button onClick={() => navigate('/video/pengaturan')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
                  <FiSettings className="text-gray-400" /> Pengaturan Video
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. FEATURED VIDEO (Sorotan Utama) */}
      {!loading && featuredVideo && (
        <section className="px-6 mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D85482] mb-4 flex items-center gap-2">
            <FiPlay size={14} className="fill-[#D85482]" /> Sedang Hangat
          </h2>
          
          <div onClick={() => setCurrentVideo(featuredVideo)} className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl shadow-[#2A4480]/20 group cursor-pointer active:scale-95 transition-transform duration-300 bg-gray-900 border border-gray-100">
            {/* Trik Auto Thumbnail HTML5 */}
            <video src={`${featuredVideo.url}#t=0.1`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" preload="metadata" muted playsInline />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A4480] via-[#2A4480]/40 to-transparent opacity-90"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white shadow-lg transform group-hover:scale-110 transition duration-300">
                <FiPlay size={32} className="fill-white ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="bg-[#D85482] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                    {featuredVideo.category}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight mb-1 tracking-wide line-clamp-1">{featuredVideo.title}</h3>
                </div>
                <button onClick={(e) => toggleLike(featuredVideo.id, e)} className="text-white/70 hover:text-[#D85482] transition-colors active:scale-75">
                  <FiHeart size={26} className={featuredVideo.isLiked ? 'text-[#D85482] fill-[#D85482]' : ''} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. CATEGORY PILLS */}
      <section className="mt-8 pl-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide pr-6">
          {categories.map((category, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                activeCategory === category 
                  ? 'bg-[#2A4480] text-white shadow-lg shadow-[#2A4480]/30 transform -translate-y-0.5' 
                  : (category === 'Favorit' ? 'bg-[#D85482]/10 text-[#D85482] border border-[#D85482]/20 hover:bg-[#D85482]/20' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2A4480]/30 hover:bg-gray-50')
              }`}
            >
              {/* Tambahkan Ikon Heart untuk Kategori Favorit */}
              {category === 'Favorit' && <FiHeart className="inline-block mr-1.5 -mt-0.5" size={14} />}
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 4. VIDEO GRID */}
      <section className="px-6 mt-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {activeCategory === 'Favorit' ? 'Video Disukai' : 'Semua Video'}
          </h2>
          <span className="text-xs font-bold text-[#2A4480] bg-[#2A4480]/10 px-3 py-1 rounded-lg">{filteredVideos.length} File</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D85482]"></div></div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FiFilm size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm font-medium">
              {activeCategory === 'Favorit' ? 'Belum ada video yang di-like.' : 'Belum ada video di kategori ini.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {filteredVideos.map((video) => (
              <div key={video.id} onClick={() => setCurrentVideo(video)} className="group cursor-pointer active:scale-95 transition-transform">
                
                <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-3 border border-gray-100 shadow-sm bg-gray-900">
                  <video src={`${video.url}#t=0.1`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" preload="metadata" muted playsInline />
                  
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/30 backdrop-blur-md p-3 rounded-full text-white shadow-lg transform group-hover:scale-110 transition">
                      <FiPlay size={20} className="fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="px-1 flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#2A3A6A] leading-snug line-clamp-1">{video.title}</h4>
                    <p className="text-[10px] font-medium text-gray-400 mt-1">{video.date.toLocaleDateString('id-ID')}</p>
                  </div>
                  <button onClick={(e) => toggleLike(video.id, e)} className="p-1">
                    <FiHeart size={16} className={`transition-all ${video.isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-gray-400'}`} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODAL PEMUTAR VIDEO (FULLSCREEN) --- */}
      {currentVideo && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[70] bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setCurrentVideo(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
              <FiX size={24} />
            </button>
            <div className="flex gap-4 items-center">
              {/* TOMBOL ARSIP DITAMBAHKAN DI SINI */}
              <button onClick={() => handleArchiveVideo(currentVideo.id)} className="text-white/80 hover:text-yellow-400 transition" title="Arsipkan">
                <FiArchive size={22} />
              </button>
              <button onClick={() => handleHideVideo(currentVideo.id)} className="text-white/80 hover:text-[#D85482] transition" title="Sembunyikan">
                <FiEyeOff size={22} />
              </button>
              <button onClick={() => handleDeleteVideo(currentVideo.id)} className="text-white/80 hover:text-red-400 transition" title="Hapus">
                <FiTrash2 size={22} />
              </button>
              <button onClick={(e) => {toggleLike(currentVideo.id, e); setCurrentVideo({...currentVideo, isLiked: !currentVideo.isLiked})}} className="active:scale-75 transition-transform">
                <FiHeart size={24} className={currentVideo.isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-white'} />
              </button>
            </div>
          </div>

          <div className="w-full max-w-3xl px-4 flex flex-col items-center">
             <video 
               src={currentVideo.url} 
               controls 
               autoPlay 
               className="w-full max-h-[70vh] rounded-2xl shadow-2xl bg-black"
             />
             <div className="mt-6 text-center">
               <h3 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h3>
               <span className="bg-[#D85482]/20 text-[#D85482] text-xs font-bold px-3 py-1 rounded-full">
                 {currentVideo.category}
               </span>
             </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING ACTION BUTTON (Upload) */}
      <div className="fixed bottom-24 right-6 z-40">
        <button onClick={() => setShowAddVideo(true)} className="bg-[#D85482] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 border-2 border-white">
          <FiVideo size={24} />
        </button>
      </div>

      {/* --- MODAL UPLOAD VIDEO --- */}
      {showAddVideo && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A]">Upload Video</h3>
              <button onClick={() => {setShowAddVideo(false); clearUpload()}} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-1.5 rounded-full"><FiX size={20}/></button>
            </div>
            
            <div className="relative mb-4">
              <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" id="video-upload" />
              {!previewUrl ? (
                <label htmlFor="video-upload" className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#FAFAFA] cursor-pointer hover:bg-gray-50 transition h-40">
                  <div className="bg-[#D85482]/10 p-3 rounded-full">
                    <FiUploadCloud size={32} className="text-[#D85482]" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium text-center">Pilih video dari galeri HP.</p>
                </label>
              ) : (
                <div className="relative h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-black group">
                  <video src={previewUrl} className="w-full h-full object-cover opacity-80" muted playsInline />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button onClick={clearUpload} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input 
              type="text" 
              placeholder="Judul Video..." 
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] mb-4 transition" 
            />

            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] mb-6 transition"
            >
              {categories.map((c, i) => c !== 'Semua' && c !== 'Favorit' && <option key={i} value={c}>{c}</option>)}
            </select>

            <button onClick={handleUpload} disabled={isUploading} className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-md flex justify-center items-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D85482] hover:bg-[#c04770] active:scale-95'}`}>
              {isUploading ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>Mengunggah...</> : 'Simpan Video'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Video;