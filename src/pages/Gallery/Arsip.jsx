import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiImage } from 'react-icons/fi';
import heic2any from 'heic2any';
const ArsipGaleri = () => {
  const navigate = useNavigate();
  const [archivedPhotos, setArchivedPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArchivedPhotos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_archived', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setArchivedPhotos([]);
      } else {
        setArchivedPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching archived photos:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedPhotos();
  }, []);

  const restorePhoto = async (id) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_archived: false })
        .eq('id', id);
      if (error) throw error;

      setArchivedPhotos(current => current.filter(photo => photo.id !== id));
    } catch (error) {
      console.error("Error restoring photo:", error.message);
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
          <h1 className="text-xl font-bold tracking-wide">Arsip Foto</h1>
          <p className="text-xs text-[#D85482] font-semibold">Menunggu untuk dikembalikan</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D85482]"></div>
        </div>
      ) : archivedPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FiImage size={40} className="opacity-50 text-[#2A3A6A]" />
          </div>
          <p className="text-sm font-medium">Tidak ada kenangan yang diarsipkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {archivedPhotos.map(photo => (
            <div 
              key={photo.id} 
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group"
            >
              <img 
                src={photo.url} 
                alt="Archived"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
              />
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  onClick={() => restorePhoto(photo.id)}
                  className="bg-[#D85482] hover:bg-[#c04770] text-white p-3 rounded-full shadow-lg transform active:scale-90 transition-all"
                >
                  <FiRefreshCcw size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArsipGaleri;