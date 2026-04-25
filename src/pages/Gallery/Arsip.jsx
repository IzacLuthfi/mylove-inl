import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiImage } from 'react-icons/fi';

const ArsipGaleri = () => {
  const navigate = useNavigate();
  const [archivedPhotos, setArchivedPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data arsip dari Supabase (nanti disesuaikan nama tabelnya)
  const fetchArchivedPhotos = async () => {
    setIsLoading(true);
    try {
      // Asumsi nama tabel adalah 'photos'
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_archived', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Simulasi data jika di Supabase belum ada data beneran
      if (!data || data.length === 0) {
        setTimeout(() => {
          setArchivedPhotos([
            { id: 1, url: 'https://picsum.photos/seed/arsip1/400/400' },
            { id: 2, url: 'https://picsum.photos/seed/arsip2/400/400' },
            { id: 3, url: 'https://picsum.photos/seed/arsip3/400/400' },
          ]);
          setIsLoading(false);
        }, 800);
      } else {
        setArchivedPhotos(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching archived photos:", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedPhotos();
  }, []);

  const restorePhoto = async (id) => {
    try {
      // Update data di database
      /*
      const { error } = await supabase
        .from('photos')
        .update({ is_archived: false })
        .eq('id', id);
      if (error) throw error;
      */

      // Hapus dari state UI agar langsung hilang tanpa refresh
      setArchivedPhotos(current => current.filter(photo => photo.id !== id));
    } catch (error) {
      console.error("Error restoring photo:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-wide">Arsip Foto</h1>
          <p className="text-xs text-gray-400">Foto yang disembunyikan dari galeri utama</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-400"></div>
        </div>
      ) : archivedPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <FiImage size={40} className="opacity-50" />
          </div>
          <p className="text-sm">Tidak ada foto yang diarsipkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {archivedPhotos.map(photo => (
            <div 
              key={photo.id} 
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group"
            >
              {/* Efek grayscale agar terlihat seperti diarsip */}
              <img 
                src={photo.url} 
                alt="Archived"
                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
              />
              
              {/* Overlay Tombol Restore */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  onClick={() => restorePhoto(photo.id)}
                  className="bg-pink-500 hover:bg-pink-400 text-white p-3 rounded-full shadow-lg transform active:scale-90 transition-all"
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