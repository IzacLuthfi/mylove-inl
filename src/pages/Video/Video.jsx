import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlay, FiVideo, FiMoreVertical,
  FiClock, FiHeart, FiFilm, FiX, FiSettings,
  FiUploadCloud, FiTrash2, FiEyeOff, FiArchive,
  FiCamera, FiStopCircle, FiCircle
} from 'react-icons/fi';

const Video = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // State Pengaturan
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortOrder, setSortOrder] = useState(localStorage.getItem('video_sortOrder') || 'newest'); 
  const [gridSize, setGridSize] = useState(Number(localStorage.getItem('video_gridSize')) || 2); 
  
  // State Data
  const [videos, setVideos] = useState([]);
  const categories = ['Semua', 'Favorit', 'Vlog Liburan', 'Kejutan', 'Random TikTok', 'Deep Talks', 'Lainnya'];

  // State Upload Biasa
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Lainnya');
  const fileInputRef = useRef(null);

  // State Pemutar Video
  const [currentVideo, setCurrentVideo] = useState(null); 

  // --- STATE KAMERA/VIDEO IN-APP ---
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Fetch Data
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
          setVideos(data.map(item => ({
            id: item.id, url: item.url, title: item.title,
            category: item.category, isLiked: item.is_liked || false,
            date: new Date(item.created_at)
          })));
        }
      } catch (error) { console.error("Error fetching videos:", error); } 
      finally { setLoading(false); }
    };
    fetchVideos();
  }, []);

  // Cleanup Kamera saat Unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  // --- LOGIKA UPLOAD ---
  const uploadVideoData = async (file, title, category) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || 'mp4';
      const fileName = `vid_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('video-bucket').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('video-bucket').getPublicUrl(fileName);

      const { data: insertData, error: dbError } = await supabase.from('videos').insert([
        { url: publicUrl, title: title, category: category, is_archived: false, is_liked: false, is_deleted: false, is_hidden: false }
      ]).select();

      if (dbError) throw dbError;

      if (insertData && insertData.length > 0) {
         setVideos([{ id: insertData[0].id, url: insertData[0].url, title: insertData[0].title, category: insertData[0].category, isLiked: false, date: new Date() }, ...videos]);
      }
    } catch (error) {
      console.error("Gagal mengupload:", error);
      alert("Gagal mengunggah video.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const clearUpload = () => {
    setSelectedFile(null); setPreviewUrl(null); setVideoTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStandardUpload = async () => {
    if (!selectedFile) return alert('Pilih video terlebih dahulu!');
    await uploadVideoData(selectedFile, videoTitle || 'Tanpa Judul', selectedCategory);
    setShowAddVideo(false);
    clearUpload();
  };

  // --- LOGIKA REKAM VIDEO IN-APP ---
  const openCamera = async () => {
    try {
      setShowAddVideo(false);
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute preview agar tidak feedback suara
      }
      streamRef.current = stream;
    } catch (err) {
      alert("Tidak dapat mengakses kamera & mikrofon. Pastikan izin telah diberikan.");
      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setRecordingTime(0);
    setShowCamera(false);
  };

  const startRecording = () => {
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? 'video/webm; codecs=vp9' : 'video/mp4';
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const fileExt = mimeType.includes('webm') ? 'webm' : 'mp4';
      const file = new File([blob], `cam_${Date.now()}.${fileExt}`, { type: mimeType });
      closeCamera();
      await uploadVideoData(file, 'Momen Spontan', 'Lainnya');
    };
    
    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    
    setRecordingTime(0);
    timerIntervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    clearInterval(timerIntervalRef.current);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- LOGIKA AKSI VIDEO ---
  const handleArchiveVideo = async (id) => {
    try { await supabase.from('videos').update({ is_archived: true }).eq('id', id); setVideos(videos.filter(v => v.id !== id)); setCurrentVideo(null); } catch (e) {}
  };
  const handleHideVideo = async (id) => {
    try { await supabase.from('videos').update({ is_hidden: true }).eq('id', id); setVideos(videos.filter(v => v.id !== id)); setCurrentVideo(null); } catch (e) {}
  };
  const handleDeleteVideo = async (id) => {
    try { await supabase.from('videos').update({ is_deleted: true }).eq('id', id); setVideos(videos.filter(v => v.id !== id)); setCurrentVideo(null); } catch (e) {}
  };
  const toggleLike = async (id, e) => {
    if(e) e.stopPropagation();
    const video = videos.find(v => v.id === id);
    try { await supabase.from('videos').update({ is_liked: !video.isLiked }).eq('id', id); setVideos(videos.map(v => v.id === id ? { ...v, isLiked: !v.isLiked } : v)); } catch (e) {}
  };

  // --- FILTERING & SORTING ---
  let filteredVideos = [...videos];
  if (activeCategory === 'Favorit') filteredVideos = filteredVideos.filter(v => v.isLiked);
  else if (activeCategory !== 'Semua') filteredVideos = filteredVideos.filter(v => v.category === activeCategory);
  
  filteredVideos.sort((a, b) => sortOrder === 'newest' ? b.date - a.date : a.date - b.date);

  const featuredVideo = videos.find(v => v.isLiked) || videos[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 font-sans text-[#2A3A6A] selection:bg-[#D85482]/30 relative">
      
      {/* 1. STICKY HEADER (Glassmorphism Elegan) */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-gray-100/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] hover:bg-gray-50 active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-[#2A4480]">Sinema I&L</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-widest">MyLove Video Archive</p>
          </div>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2.5 rounded-full transition-all ${showMenu ? 'bg-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}>
            <FiMoreVertical size={20} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                <button onClick={() => navigate('/video/pengaturan')} className="w-full px-5 py-3.5 text-left text-sm text-[#2A3A6A] font-bold hover:bg-gray-50 flex items-center gap-3">
                  <FiSettings className="text-[#D85482]" size={18} /> Pengaturan Video
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* OVERLAY LOADING UPLOAD */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2A4480] mb-4"></div>
            <p className="text-[#2A4480] font-bold tracking-wide">Menyimpan Video...</p>
          </div>
        </div>
      )}

      {/* 2. FEATURED VIDEO (Cinematic Look) */}
      {!loading && featuredVideo && (
        <section className="px-6 mt-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D85482] animate-pulse"></span> Sorotan Utama
          </h2>
          
          <div onClick={() => setCurrentVideo(featuredVideo)} className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#2A4480]/20 group cursor-pointer active:scale-95 transition-transform duration-300 bg-gray-900 border border-gray-100">
            <video src={`${featuredVideo.url}#t=0.1`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90" preload="metadata" muted playsInline />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-full border border-white/30 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition duration-300">
                <FiPlay size={28} className="fill-white ml-1.5" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-end">
                <div className="pr-4">
                  <span className="bg-[#D85482] text-white text-[9px] font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm uppercase tracking-widest">
                    {featuredVideo.category}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight mb-1 tracking-wide line-clamp-2 drop-shadow-md">{featuredVideo.title}</h3>
                </div>
                <button onClick={(e) => toggleLike(featuredVideo.id, e)} className="p-2 rounded-full bg-black/20 backdrop-blur-md active:scale-75 transition-transform">
                  <FiHeart size={20} className={featuredVideo.isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-white'} />
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
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 border ${
                activeCategory === category 
                  ? 'bg-[#2A4480] text-white border-[#2A4480] shadow-lg shadow-[#2A4480]/30' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#2A4480]/30 hover:bg-gray-50'
              }`}
            >
              {category === 'Favorit' && <FiHeart className={`inline-block mr-1.5 -mt-0.5 ${activeCategory === category ? 'text-white' : 'text-[#D85482]'}`} size={14} />}
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 4. VIDEO GRID */}
      <section className="px-6 mt-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {activeCategory === 'Favorit' ? 'Video Disukai' : 'Koleksi Video'}
          </h2>
          <span className="text-[10px] font-bold text-white bg-[#2A4480] px-3 py-1 rounded-full">{filteredVideos.length} Klip</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D85482]"></div></div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
            <div className="bg-[#D85482]/10 p-5 rounded-full mb-4">
              <FiFilm size={32} className="text-[#D85482]" />
            </div>
            <p className="text-[#2A3A6A] font-bold text-sm">
              {activeCategory === 'Favorit' ? 'Belum ada video favorit.' : 'Belum ada video.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {filteredVideos.map((video) => (
              <div key={video.id} onClick={() => setCurrentVideo(video)} className="group cursor-pointer active:scale-95 transition-transform bg-white rounded-[1.5rem] p-2 shadow-sm border border-gray-100 hover:shadow-md">
                
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-gray-900">
                  <video src={`${video.url}#t=0.1`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" preload="metadata" muted playsInline />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/30 backdrop-blur-md p-3 rounded-full text-white shadow-lg transform group-hover:scale-110 transition">
                      <FiPlay size={20} className="fill-white ml-0.5" />
                    </div>
                  </div>
                  
                  <button onClick={(e) => toggleLike(video.id, e)} className="absolute top-2 right-2 p-1.5 bg-black/20 backdrop-blur-sm rounded-full z-10 hover:scale-110 transition-transform">
                    <FiHeart className={`transition-all ${video.isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-white'}`} size={14} />
                  </button>
                </div>

                <div className="px-2 pb-1">
                  <h4 className="text-xs font-bold text-[#2A3A6A] leading-snug line-clamp-1">{video.title}</h4>
                  <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{video.date.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODAL PEMUTAR VIDEO (FULLSCREEN) --- */}
      {currentVideo && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[70] bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setCurrentVideo(null)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition backdrop-blur-md active:scale-90">
              <FiX size={24} />
            </button>
            <div className="flex gap-4 items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <button onClick={() => handleArchiveVideo(currentVideo.id)} className="text-white hover:text-yellow-400 transition active:scale-90" title="Arsipkan"><FiArchive size={20} /></button>
              <button onClick={() => handleHideVideo(currentVideo.id)} className="text-white hover:text-[#D85482] transition active:scale-90" title="Sembunyikan"><FiEyeOff size={20} /></button>
              <button onClick={() => handleDeleteVideo(currentVideo.id)} className="text-white hover:text-red-500 transition active:scale-90" title="Hapus"><FiTrash2 size={20} /></button>
              <button onClick={(e) => {toggleLike(currentVideo.id, e); setCurrentVideo({...currentVideo, isLiked: !currentVideo.isLiked})}} className="active:scale-75 transition-transform ml-1">
                <FiHeart size={22} className={currentVideo.isLiked ? 'text-[#D85482] fill-[#D85482]' : 'text-white'} />
              </button>
            </div>
          </div>

          <div className="w-full max-w-3xl px-4 flex flex-col items-center mt-10">
             <video src={currentVideo.url} controls autoPlay className="w-full max-h-[70vh] rounded-2xl shadow-2xl bg-black border border-white/10" />
             <div className="mt-8 text-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
               <span className="bg-[#D85482] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block uppercase tracking-widest">{currentVideo.category}</span>
               <h3 className="text-xl font-bold text-white leading-tight">{currentVideo.title}</h3>
             </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING ACTION BUTTONS (Upload & Record) */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
        {/* Tombol Kamera (Rekam Langsung) */}
        <button onClick={openCamera} className="bg-[#D85482] text-white p-4 rounded-full shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-[3px] border-white">
          <FiVideo size={24} />
        </button>
        {/* Tombol Upload Biasa */}
        <button onClick={() => setShowAddVideo(true)} className="bg-[#2A4480] text-white p-4 rounded-full shadow-lg shadow-[#2A4480]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-[3px] border-white">
          <FiUploadCloud size={24} />
        </button>
      </div>

      {/* --- UI REKAM VIDEO IN-APP (FULLSCREEN) --- */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
          {/* Header Kamera */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
             <button onClick={closeCamera} disabled={isRecording} className={`p-3 rounded-full text-white backdrop-blur-md transition-all ${isRecording ? 'opacity-0 pointer-events-none' : 'bg-white/20 hover:bg-white/30 active:scale-90'}`}>
               <FiX size={24} />
             </button>
             
             {/* Indikator Waktu Perekaman */}
             <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
               {isRecording && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>}
               <span className="text-white text-xs font-bold tracking-widest">{formatTime(recordingTime)}</span>
             </div>
          </div>

          {/* Viewfinder Video */}
          <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-gray-900">
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
             
             {/* Frame/Grid Estetika Perekaman */}
             {isRecording && (
               <div className="absolute inset-4 border-2 border-red-500/50 rounded-lg pointer-events-none transition-all"></div>
             )}
          </div>

          {/* Kontrol Bawah Kamera */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-center z-10 pb-8 gap-4">
            {isRecording ? (
              <button onClick={stopRecording} className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-90 transition-all border-[4px] border-red-500">
                <FiStopCircle size={40} className="text-red-500" />
              </button>
            ) : (
              <button onClick={startRecording} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-90 transition-transform border-[4px] border-gray-300">
                <div className="w-14 h-14 bg-red-500 rounded-full"></div>
              </button>
            )}
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              {isRecording ? 'Merekam Video...' : 'Tekan untuk Merekam'}
            </p>
          </div>
        </div>
      )}

      {/* --- MODAL UPLOAD VIDEO BIASA --- */}
      {showAddVideo && (
        <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A3A6A] flex items-center gap-2">
                <FiUploadCloud className="text-[#2A4480]" /> Upload Video
              </h3>
              <button onClick={() => {setShowAddVideo(false); clearUpload()}} className="text-gray-400 hover:text-[#2A3A6A] bg-gray-100 p-2 rounded-full"><FiX size={18}/></button>
            </div>
            
            <div className="relative mb-6">
              <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" id="video-upload" />
              {!previewUrl ? (
                <label htmlFor="video-upload" className="border-2 border-dashed border-[#2A4480]/30 rounded-[1.5rem] p-8 flex flex-col items-center justify-center gap-3 bg-[#FAFAFA] cursor-pointer hover:bg-[#2A4480]/5 transition group h-48">
                  <div className="bg-[#2A4480]/10 p-4 rounded-full group-hover:scale-110 transition duration-300">
                    <FiUploadCloud size={32} className="text-[#2A4480]" />
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm text-[#2A3A6A] font-bold">Pilih File Video</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">MP4, WEBM, MOV</p>
                  </div>
                </label>
              ) : (
                <div className="relative h-48 rounded-[1.5rem] overflow-hidden border border-gray-200 shadow-inner bg-black group">
                  <video src={previewUrl} className="w-full h-full object-cover opacity-80" muted playsInline />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button onClick={clearUpload} className="bg-red-500/90 text-white p-4 rounded-full hover:bg-red-600 transition shadow-lg active:scale-90">
                      <FiTrash2 size={24} />
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
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-4 text-[#2A3A6A] font-bold focus:outline-none focus:border-[#D85482] mb-4 transition" 
            />

            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-4 text-[#2A3A6A] font-bold focus:outline-none focus:border-[#D85482] mb-6 transition appearance-none"
            >
              {categories.map((c, i) => c !== 'Semua' && c !== 'Favorit' && <option key={i} value={c}>{c}</option>)}
            </select>

            <button onClick={handleStandardUpload} disabled={isUploading || !selectedFile} className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg flex justify-center items-center gap-2 ${isUploading || !selectedFile ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#2A4480] hover:bg-[#1f3360] shadow-[#2A4480]/30 active:scale-95'}`}>
              {isUploading ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> Mengunggah...</> : 'Simpan ke Galeri'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Video;