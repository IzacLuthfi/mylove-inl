import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw, FiInbox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ArsipPesan = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchArchive = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('is_archived', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching archive:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const restoreNote = async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_archived: false })
        .eq('id', id);

      if (error) throw error;
      setNotes(currentNotes => currentNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error restoring note:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] p-6 font-sans">
      
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-100 shadow-sm hover:bg-gray-50 rounded-full transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-xl font-bold tracking-wide">Arsip Pesan</h1>
           <p className="text-xs text-[#2A4480] font-semibold">Tersimpan aman</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A4480]"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FiInbox size={40} className="opacity-50 text-[#2A3A6A]" />
          </div>
          <p className="text-sm font-medium">Kotak arsip kosong.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm transition-all duration-300">
              <h3 className="font-bold text-lg text-[#2A3A6A] mb-1">{note.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {note.content}
              </p>
              <div className="flex justify-end">
                <button onClick={() => restoreNote(note.id)} className="text-[#2A4480] font-bold text-xs flex items-center gap-2 px-4 py-2 bg-[#2A4480]/10 hover:bg-[#2A4480]/20 rounded-xl transition-colors active:scale-95">
                  <FiRefreshCcw size={14} /> Kembalikan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArsipPesan;