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
      
      // Filter otomatis tanpa harus fetch ulang ke database (lebih cepat)
      setNotes(currentNotes => currentNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error restoring note:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold tracking-wide">Arsip Pesan</h1>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-400"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <FiInbox size={48} className="mb-4 opacity-50" />
          <p>Belum ada pesan yang diarsipkan.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map(note => (
            <div 
              key={note.id} 
              className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-blue-50 mb-1">{note.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                {note.content}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => restoreNote(note.id)}
                  className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-2 px-3 py-1.5 bg-pink-400/10 hover:bg-pink-400/20 rounded-lg transition-colors"
                >
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

export default ArsipPesan;