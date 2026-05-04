import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiFilm } from 'react-icons/fi';

const ArsipVideo = () => {
  const navigate = useNavigate();
  const [archivedVideos, setArchivedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArchivedVideos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_archived', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArchivedVideos(data || []);
    } catch (error) {
      console.error("Error fetching archived videos:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedVideos();
  }, []);

  const restoreVideo = async (id) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_archived: false })
        .eq('id', id);
      if (error) throw error;

      setArchivedVideos(current => current.filter(video => video.id !== id));
    } catch (error) {
      console.error("Error restoring video:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-wide">Arsip Video</h1>
          <p className="text-xs text-[#2A4480] font-semibold">Tersimpan dengan aman</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A4480]"></div>
        </div>
      ) : archivedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FiFilm size={40} className="opacity-50 text-[#2A3A6A]" />
          </div>
          <p className="text-sm font-medium">Tidak ada video yang diarsipkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {archivedVideos.map(video => (
            <div 
              key={video.id} 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 group shadow-sm"
            >
              <video 
                src={`${video.url}#t=0.1`} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
                preload="metadata"
                muted 
                playsInline
              />
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  onClick={() => restoreVideo(video.id)}
                  className="bg-[#2A4480] hover:bg-[#1f3360] text-white p-3 rounded-full shadow-lg transform active:scale-90 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  <FiRefreshCcw size={16} /> Kembalikan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArsipVideo;