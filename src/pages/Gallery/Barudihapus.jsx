import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import heic2any from 'heic2any';
const BaruDihapus = () => {
  const navigate = useNavigate();
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeletedPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_deleted', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setDeletedPhotos(data || []);
    } catch (error) {
      console.error("Error fetching:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPhotos();
  }, []);

  const restorePhoto = async (id) => {
    try {
      await supabase.from('photos').update({ is_deleted: false }).eq('id', id);
      setDeletedPhotos(current => current.filter(photo => photo.id !== id));
    } catch (error) {
      console.error("Error restoring:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-wide">Baru Dihapus</h1>
          <p className="text-xs text-red-500 font-semibold">Bisa dipulihkan kembali</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : deletedPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FiTrash size={40} className="opacity-50 text-[#2A3A6A]" />
          </div>
          <p className="text-sm font-medium">Kotak sampah kosong.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {deletedPhotos.map(photo => (
            <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-red-100 group">
              <img src={photo.url} alt="Deleted" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button onClick={() => restorePhoto(photo.id)} className="bg-white text-green-600 p-3 rounded-full shadow-lg transform active:scale-90 transition-all font-bold text-xs flex items-center gap-1">
                  <FiRefreshCcw size={14} /> Pulihkan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaruDihapus;