import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const BarudihapusPesan = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDeleted = async () => {
    try {
      const { data, error } = await supabase.from('notes').select('*').eq('is_deleted', true).order('created_at', { ascending: false });
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching:", error.message);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchDeleted(); }, []);

  const restoreNote = async (id) => {
    try {
      await supabase.from('notes').update({ is_deleted: false }).eq('id', id);
      setNotes(currentNotes => currentNotes.filter(n => n.id !== id));
    } catch (error) { console.error("Error restoring:", error.message); }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-100 shadow-sm hover:bg-gray-50 rounded-full transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-xl font-bold tracking-wide">Pesan Dihapus</h1>
           <p className="text-xs text-red-500 font-semibold">Pulihkan pesan</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center h-40 items-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div></div>
      ) : notes.length === 0 ? (
        <div className="text-center mt-32 text-gray-400">
          <div className="p-4 bg-gray-100 rounded-full mb-4 inline-block"><FiTrash size={40} className="opacity-50" /></div>
          <p className="text-sm font-medium">Kotak sampah kosong.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm">
              <h3 className="font-bold text-gray-500 line-through mb-1">{note.title}</h3>
              <button onClick={() => restoreNote(note.id)} className="text-green-600 bg-green-50 px-4 py-2 rounded-xl mt-3 flex items-center gap-2 text-xs font-bold active:scale-95 transition-transform"><FiRefreshCcw size={14} /> Kembalikan</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BarudihapusPesan;