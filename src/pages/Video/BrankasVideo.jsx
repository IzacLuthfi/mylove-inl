import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiLock, FiUnlock, FiEye } from 'react-icons/fi';

const BrankasVideo = () => {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [hiddenVideos, setHiddenVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === '071024') {
      setIsUnlocked(true);
      fetchHiddenVideos();
    } else {
      alert("PIN Salah! Akses ditolak.");
      setPassword('');
    }
  };

  const fetchHiddenVideos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_hidden', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setHiddenVideos(data || []);
    } catch (error) {
      console.error("Error fetching hidden:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const unhideVideo = async (id) => {
    try {
      await supabase.from('videos').update({ is_hidden: false }).eq('id', id);
      setHiddenVideos(current => current.filter(video => video.id !== id));
    } catch (error) {
      console.error("Error unhiding:", error.message);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#2A3A6A] text-white flex flex-col items-center justify-center p-6 selection:bg-[#D85482]">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <FiArrowLeft size={20} />
        </button>
        <div className="bg-white/10 p-6 rounded-full mb-6 shadow-xl backdrop-blur-md">
          <FiLock size={48} className="text-[#D85482]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Brankas Video</h1>
        <p className="text-sm text-gray-300 mb-8 text-center max-w-xs">Masukkan PIN rahasia untuk membuka sinema rahasia I&L.</p>
        
        <form onSubmit={handleUnlock} className="flex flex-col items-center w-full max-w-xs">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="• • • • • •" 
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-[#D85482] transition mb-6"
            maxLength={6}
          />
          <button type="submit" className="w-full bg-[#D85482] text-white font-bold py-4 rounded-xl hover:bg-[#c04770] transition shadow-lg active:scale-95 flex justify-center items-center gap-2">
            <FiUnlock /> Buka Brankas
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white p-6 font-sans pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 border border-white/5 rounded-full active:scale-90 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-wide">Brankas Rahasia</h1>
          <p className="text-xs text-[#D85482] font-semibold">Terkunci & Aman</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D85482]"></div>
        </div>
      ) : hiddenVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <FiLock size={40} className="opacity-50" />
          </div>
          <p className="text-sm font-medium">Brankas masih kosong.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {hiddenVideos.map(video => (
            <div key={video.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 border border-white/5 group">
              <video 
                src={`${video.url}#t=0.1`} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300"
                preload="metadata"
                muted 
                playsInline 
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button onClick={() => unhideVideo(video.id)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg transform active:scale-90 transition-all flex items-center gap-2 text-xs font-bold">
                  <FiEye size={16} /> Kembalikan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrankasVideo;