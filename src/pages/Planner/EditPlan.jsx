import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiMapPin, 
  FiCalendar, FiClock, FiAlignLeft, FiMap, 
  FiList, FiShield 
} from 'react-icons/fi';

const EditPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID rencana dari URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    map_iframe: ''
  });

  const [agendas, setAgendas] = useState([]);
  const [backupPlans, setBackupPlans] = useState([]);

  // Fetch data lama dari Supabase
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const { data, error } = await supabase
          .from('planners')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            date: data.date || '',
            time: data.time || '',
            location: data.location || '',
            map_iframe: data.map_iframe || ''
          });
          setAgendas(data.sub_plans || []);
          setBackupPlans(data.backup_plans || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIKA SUSUNAN ACARA ---
  const addAgenda = () => {
    setAgendas([...agendas, { id: Date.now(), activity: '', startTime: '', endTime: '', location: '' }]);
  };
  const updateAgenda = (id, field, value) => {
    setAgendas(agendas.map(ag => ag.id === id ? { ...ag, [field]: value } : ag));
  };
  const removeAgenda = (id) => {
    setAgendas(agendas.filter(ag => ag.id !== id));
  };

  // --- LOGIKA AGENDA CADANGAN ---
  const addBackupPlan = () => {
    setBackupPlans([...backupPlans, { id: Date.now(), title: '', description: '' }]);
  };
  const updateBackupPlan = (id, field, value) => {
    setBackupPlans(backupPlans.map(bp => bp.id === id ? { ...bp, [field]: value } : bp));
  };
  const removeBackupPlan = (id) => {
    setBackupPlans(backupPlans.filter(bp => bp.id !== id));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return alert("Judul dan Tanggal wajib diisi!");
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('planners').update({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        map_iframe: formData.map_iframe,
        sub_plans: agendas, 
        backup_plans: backupPlans 
      }).eq('id', id);

      if (error) throw error;
      navigate(-1); // Kembali ke Planner setelah sukses edit
    } catch (error) {
      console.error("Gagal memperbarui rencana:", error.message);
      alert("Terjadi kesalahan saat memperbarui rencana.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D85482]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans pb-24 selection:bg-[#D85482]/30">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-xl font-bold tracking-wide">Edit Rencana</h1>
           <p className="text-xs text-[#D85482] font-semibold uppercase tracking-wider">Perbarui Detail Kencan</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        
        {/* 1. INFORMASI UTAMA */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest border-b border-gray-100 pb-3">Informasi Utama</h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Judul Kencan *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 font-bold focus:outline-none focus:border-[#D85482] transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><FiCalendar /> Tanggal *</label>
                <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:border-[#D85482] transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><FiClock /> Waktu Kumpul</label>
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:border-[#D85482] transition" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><FiMapPin /> Lokasi Tujuan Utama</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:border-[#D85482] transition" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><FiMap /> Link Embed Maps (Opsional)</label>
              <textarea name="map_iframe" value={formData.map_iframe} onChange={handleInputChange} rows="2" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 text-xs text-gray-500 focus:outline-none focus:border-[#D85482] transition resize-none"></textarea>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><FiAlignLeft /> Deskripsi Singkat</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D85482] transition resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* 2. SUSUNAN ACARA */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><FiList/> Susunan Acara</h3>
            <button type="button" onClick={addAgenda} className="text-[10px] bg-[#2A4480]/10 text-[#2A4480] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95">
              <FiPlus /> Tambah Jam
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {agendas.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2 italic">Belum ada susunan acara. Tambahkan jadwal jam demi jam.</p>
            ) : (
              agendas.map((ag) => (
                <div key={ag.id} className="flex gap-3 items-start bg-[#FAFAFA] p-3.5 rounded-xl border border-gray-100 relative">
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5">
                        <FiClock size={12} className="text-gray-400" />
                        <input type="time" value={ag.startTime} onChange={(e) => updateAgenda(ag.id, 'startTime', e.target.value)} className="text-xs font-bold focus:outline-none w-16" />
                      </div>
                      <span className="text-gray-300 font-bold">-</span>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5">
                        <FiClock size={12} className="text-gray-400" />
                        <input type="time" value={ag.endTime} onChange={(e) => updateAgenda(ag.id, 'endTime', e.target.value)} className="text-xs font-bold focus:outline-none w-16" />
                      </div>
                    </div>
                    <input type="text" value={ag.activity} onChange={(e) => updateAgenda(ag.id, 'activity', e.target.value)} placeholder="Kegiatan" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-[#2A4480]" />
                    <div className="flex items-center relative">
                      <FiMapPin className="absolute left-3 text-gray-400" size={14}/>
                      <input type="text" value={ag.location} onChange={(e) => updateAgenda(ag.id, 'location', e.target.value)} placeholder="Lokasi (Opsional)" className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#2A4480]" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeAgenda(ag.id)} className="text-gray-300 hover:text-red-500 mt-1 p-1">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. AGENDA CADANGAN */}
        <div className="bg-[#D85482]/5 p-5 rounded-2xl border border-[#D85482]/20 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#D85482]/20 pb-3 mb-4">
            <h3 className="text-xs font-bold text-[#D85482] uppercase tracking-widest flex items-center gap-1"><FiShield/> Agenda Cadangan</h3>
            <button type="button" onClick={addBackupPlan} className="text-[10px] bg-[#D85482] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95">
              <FiPlus /> Tambah Plan
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {backupPlans.length === 0 ? (
              <p className="text-xs text-[#D85482]/60 text-center py-2 italic">Buat Plan B atau Plan C jika rencana utama batal.</p>
            ) : (
              backupPlans.map((bp, idx) => (
                <div key={bp.id} className="flex gap-3 items-start bg-white p-3.5 rounded-xl border border-[#D85482]/20 relative shadow-sm">
                  <div className="bg-[#D85482] text-white text-xs font-bold px-3 py-1.5 rounded-lg mt-1 shrink-0">
                    Plan {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input type="text" value={bp.title} onChange={(e) => updateBackupPlan(bp.id, 'title', e.target.value)} placeholder="Nama Plan" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-[#D85482]" />
                    <textarea value={bp.description} onChange={(e) => updateBackupPlan(bp.id, 'description', e.target.value)} placeholder="Detail plan..." rows="2" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#D85482] resize-none"></textarea>
                  </div>
                  <button type="button" onClick={() => removeBackupPlan(bp.id)} className="text-red-300 hover:text-red-500 mt-1 p-1">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A4480] hover:bg-[#1f3360] active:scale-95'}`}>
          {isSubmitting ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> Memperbarui...</> : 'Perbarui Rencana'}
        </button>

      </form>
    </div>
  );
};

export default EditPlan;