import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { 
  FiSearch, FiMoreVertical, FiHeart, 
  FiArchive, FiSettings, FiEdit3, FiTrash2 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Notes = () => {

  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [filterLiked, setFilterLiked] = useState(false);
  const [sortBy, setSortBy] = useState('created'); // created / updated
  const [viewMode, setViewMode] = useState('list'); // list / grid

  // FETCH
  const fetchNotes = async () => {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('is_archived', false)
      .eq('is_deleted', false);

    query = sortBy === 'created'
      ? query.order('created_at', { ascending: false })
      : query.order('updated_at', { ascending: false });

    const { data } = await query;
    setNotes(data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, [sortBy]);

  // SAVE (ADD / EDIT)
  const saveNote = async () => {
    if (!title || !content) return;

    if (editMode) {
      await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date() })
        .eq('id', currentId);
    } else {
      await supabase.from('notes').insert([
        { title, content }
      ]);
    }

    resetForm();
    fetchNotes();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setShowForm(false);
    setEditMode(false);
    setCurrentId(null);
  };

  // EDIT
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditMode(true);
    setCurrentId(note.id);
    setShowForm(true);
  };

  // LIKE
  const toggleLike = async (note) => {
    await supabase
      .from('notes')
      .update({ is_pinned: !note.is_pinned })
      .eq('id', note.id);

    fetchNotes();
  };

  // ARCHIVE
  const archiveNote = async (id) => {
    await supabase
      .from('notes')
      .update({ is_archived: true })
      .eq('id', id);

    fetchNotes();
  };

  // DELETE
  const deleteNote = async (id) => {
    await supabase
      .from('notes')
      .update({ is_deleted: true })
      .eq('id', id);

    fetchNotes();
  };

  // FILTER
  let filtered = notes;

  if (filterLiked) {
    filtered = filtered.filter(n => n.is_pinned);
  }

  filtered = filtered.filter(n =>
    (n.title + n.content).toLowerCase().includes(search.toLowerCase())
  );

  // HIGHLIGHT
  const highlight = (text) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase()
        ? <span key={i} className="bg-white text-black px-1 rounded">{part}</span>
        : part
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-28">

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold">Catatan Hati</h1>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-[#1E293B] p-3 rounded-xl w-56">

              <button 
                onClick={() => setFilterLiked(!filterLiked)}
                className="flex gap-2 p-2 w-full hover:bg-white/10"
              >
                <FiHeart /> {filterLiked ? 'Semua Catatan' : 'Pesan Disukai'}
              </button>

              <button 
                onClick={() => navigate('/arsip')}
                className="flex gap-2 p-2 w-full hover:bg-white/10"
              >
                <FiArchive /> Arsip Pesan
              </button>

              <button 
                onClick={() => navigate('/pengaturan')}
                className="flex gap-2 p-2 w-full hover:bg-white/10"
              >
                <FiSettings /> Pengaturan
              </button>

            </div>
          )}
        </div>
      </header>

      {/* SEARCH */}
      <div className="px-6 mt-4">
        <div className="bg-white/10 flex items-center px-4 py-2 rounded-xl">
          <FiSearch className="mr-2" />
          <input
            type="text"
            placeholder="Cari catatan..."
            className="bg-transparent w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* NOTES */}
      <div className={`px-4 mt-6 gap-4 ${
        viewMode === 'grid' ? 'grid grid-cols-2' : 'flex flex-col'
      }`}>
        {filtered.map(note => (
          <div key={note.id} className="bg-white/5 p-4 rounded-2xl">

            <div className="flex justify-between items-start">
              <h3 className="font-bold">
                {highlight(note.title || 'Tanpa Judul')}
              </h3>

              <div className="flex gap-3">

                <FiHeart 
                  onClick={() => toggleLike(note)}
                  className={`cursor-pointer ${note.is_pinned ? 'text-pink-500' : ''}`}
                />

                <FiEdit3 
                  onClick={() => editNote(note)}
                  className="cursor-pointer text-blue-400"
                />

                <FiTrash2 
                  onClick={() => deleteNote(note.id)}
                  className="cursor-pointer text-red-400"
                />

                <FiArchive 
                  onClick={() => archiveNote(note.id)}
                  className="cursor-pointer text-yellow-400"
                />

              </div>
            </div>

            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {highlight(note.content)}
            </p>

          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-[#1E293B] p-6 rounded-xl w-80">

            <h2 className="mb-4 font-bold">
              {editMode ? 'Edit Catatan' : 'Tulis Catatan'}
            </h2>

            <input
              placeholder="Judul"
              className="w-full mb-3 p-2 bg-white/10 rounded"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />

            <textarea
              placeholder="Isi pesan..."
              className="w-full p-2 bg-white/10 rounded"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
            />

            <div className="flex gap-2 mt-4">
              <button 
                onClick={saveNote}
                className="flex-1 bg-pink-500 p-2 rounded"
              >
                Simpan
              </button>

              <button 
                onClick={resetForm}
                className="flex-1 bg-gray-500 p-2 rounded"
              >
                Kembali
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <div className="fixed bottom-24 right-6">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-pink-500 p-4 rounded-full"
        >
          <FiEdit3 />
        </button>
      </div>

    </div>
  );
};

export default Notes;