import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiTrash } from 'react-icons/fi';

const Plandihapus = () => {
  const navigate = useNavigate();
  const [deletedPlans, setDeletedPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeleted = async () => {
    try {
      const { data, error } = await supabase.from('planners').select('*').eq('is_deleted', true);
      if (error) throw error;
      setDeletedPlans(data || []);
    } catch (error) {
      console.error("Error:", error.message);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchDeleted(); }, []);

  const restorePlan = async (id) => {
    try {
      await supabase.from('planners').update({ is_deleted: false }).eq('id', id);
      setDeletedPlans(current => current.filter(p => p.id !== id));
    } catch (error) { console.error("Error restoring:", error.message); }
  };

  const deletePermanent = async (id) => {
    if (!window.confirm("Hapus permanen? Tidak bisa dikembalikan lagi.")) return;
    try {
      await supabase.from('planners').delete().eq('id', id);
      setDeletedPlans(current => current.filter(p => p.id !== id));
    } catch (error) { console.error("Error deleting:", error.message); }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-wide">Rencana Dihapus</h1>
          <p className="text-xs text-red-500 font-semibold">Pulihkan jadwal kencan</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div></div>
      ) : deletedPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-gray-100 rounded-full mb-4"><FiTrash size={40} className="opacity-50" /></div>
          <p className="text-sm font-medium">Kotak sampah kosong.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {deletedPlans.map(plan => (
            <div key={plan.id} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col gap-3">
              <div>
                <h4 className="font-bold text-gray-500 line-through">{plan.title}</h4>
                <p className="text-xs text-gray-400">{plan.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => restorePlan(plan.id)} className="flex-1 bg-green-100 text-green-600 font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform"><FiRefreshCcw /> Pulihkan</button>
                <button onClick={() => deletePermanent(plan.id)} className="flex-1 bg-red-100 text-red-600 font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform"><FiTrash /> Hapus Permanen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plandihapus;