import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { FiArrowLeft, FiRefreshCcw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ArsipPesan = () => {

  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const fetchArchive = async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('is_archived', true)
      .order('created_at', { ascending: false });

    setNotes(data || []);
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const restoreNote = async (id) => {
    await supabase
      .from('notes')
      .update({ is_archived: false })
      .eq('id', id);

    fetchArchive();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4">

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Arsip Pesan</h1>
      </div>

      <div className="flex flex-col gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white/5 p-4 rounded-xl">

            <h3 className="font-bold">{note.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {note.content}
            </p>

            <button
              onClick={() => restoreNote(note.id)}
              className="text-green-400 text-xs mt-2 flex items-center gap-1"
            >
              <FiRefreshCcw /> Kembalikan
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ArsipPesan;