import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import Swal from 'sweetalert2';
import { 
  FiArrowLeft, FiMapPin, FiPlus, FiNavigation, 
  FiCalendar, FiX, FiTrash2, FiMap
} from 'react-icons/fi';

const Kenangan = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch Data
  const fetchPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('memory_maps')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setPlaces(data || []);
    } catch (error) {
      console.error("Error fetching places:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSavePlace = async () => {
    if (!formData.title || !formData.location_name || !formData.date) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Judul, Lokasi, dan Tanggal wajib diisi!', confirmButtonColor: '#2A4480', customClass: { popup: 'rounded-3xl' }});
      return;
    }

    try {
      const { error } = await supabase.from('memory_maps').insert([formData]);
      if (error) throw error;

      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Jejak kenangan disimpan!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-2xl' } });
      
      setShowModal(false);
      setFormData({ title: '', location_name: '', description: '', date: new Date().toISOString().split('T')[0] });
      fetchPlaces();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.message, confirmButtonColor: '#2A4480', customClass: { popup: 'rounded-3xl' } });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus jejak ini?',
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D85482',
      cancelButtonColor: '#2A4480',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) {
      try {
        await supabase.from('memory_maps').delete().eq('id', id);
        setPlaces(places.filter(p => p.id !== id));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Dihapus!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-2xl' } });
      } catch (error) { console.error(error); }
    }
  };

  // Helper fungsi untuk membuat URL Google Maps Embed
  const getMapIframeUrl = (location) => {
    if (!location) return "";
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] pb-28 font-sans selection:bg-[#2A4480]/30 relative">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-gray-100/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] hover:bg-gray-50 active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-[#2A4480]">Peta Kenangan</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Jejak Langkah Kita</p>
          </div>
        </div>
      </header>

      {/* STATISTIK HEADER */}
      <section className="px-6 mt-8 mb-8">
        <div className="bg-[#2A4480] rounded-[2rem] p-6 relative overflow-hidden shadow-lg shadow-[#2A4480]/30 text-white">
          <div className="absolute -right-4 -bottom-4 opacity-10"><FiMap size={120} /></div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Destinasi</p>
            <div className="flex items-end gap-2">
              <h2 className="text-5xl font-black drop-shadow-md">{places.length}</h2>
              <span className="text-sm font-bold opacity-90 mb-1.5">Lokasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE LIST DENGAN IFRAME */}
      <section className="px-6">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2A4480]"></div></div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-[2rem] shadow-sm">
            <FiMapPin size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-medium">Belum ada jejak kencan yang ditandai.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {places.map((place) => (
              <div key={place.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                
                {/* 1. MAP IFRAME DI DALAM KARTU */}
                <div className="w-full h-48 bg-gray-100 relative">
                  <iframe 
                    title={place.location_name}
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={getMapIframeUrl(place.location_name)}
                    className="grayscale-[0.2] contrast-[1.1]"
                  />
                  {/* Overlay untuk klik navigasi asli */}
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.location_name)}`, '_blank')}
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-[#2A4480] active:scale-90 transition-all border border-gray-200"
                  >
                    <FiNavigation size={18} />
                  </button>
                </div>

                {/* 2. DETAIL KONTEN */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black text-lg text-[#2A3A6A] leading-tight mb-1">{place.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <FiCalendar className="text-[#D85482]" />
                        {new Date(place.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(place.id)} className="text-gray-300 hover:text-red-500 transition-colors"><FiTrash2 size={18}/></button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D85482] mb-3">
                    <FiMapPin /> {place.location_name}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-pink-100 pl-3">
                    "{place.description}"
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* FLOAT BUTTON */}
      <div className="fixed bottom-24 right-6 z-40">
        <button onClick={() => setShowModal(true)} className="bg-[#D85482] text-white p-4 rounded-full shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-[3px] border-white">
          <FiPlus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* MODAL TAMBAH TEMPAT DENGAN LIVE PREVIEW MAP */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#2A3A6A]/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
              <h3 className="text-xl font-bold text-[#2A3A6A] flex items-center gap-2">
                <FiMapPin className="text-[#D85482]" /> Tandai Kenangan
              </h3>
              <button onClick={() => setShowModal(false)} className="bg-gray-100 p-2 rounded-full text-gray-500"><FiX size={18}/></button>
            </div>

            <div className="flex flex-col gap-4">
              {/* LIVE PREVIEW IFRAME DI FORM */}
              {formData.location_name && (
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-gray-200 mb-2 shadow-inner">
                   <iframe 
                    title="Preview"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={getMapIframeUrl(formData.location_name)}
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Judul Momen</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="ex: Kencan Pertama Kita" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2A3A6A] focus:outline-none focus:border-[#D85482] transition" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nama Lokasi (Sesuai Google Maps)</label>
                <input type="text" name="location_name" value={formData.location_name} onChange={handleInputChange} placeholder="ex: Alun-alun Batang" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2A3A6A] focus:outline-none focus:border-[#D85482] transition" />
                <p className="text-[9px] text-gray-400 mt-1">*Ketik nama tempat secara lengkap agar peta muncul akurat.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tanggal</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block invisible">Simpan</label>
                   <button onClick={handleSavePlace} className="w-full bg-[#2A4480] text-white font-bold py-3 rounded-xl transition shadow-lg active:scale-95">Simpan</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Cerita Singkat</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Apa kenangan manis di tempat ini?" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition resize-none" />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Kenangan;