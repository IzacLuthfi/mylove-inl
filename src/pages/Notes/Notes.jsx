import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { 
  FiSearch, FiMoreVertical, FiHeart, 
  FiArchive, FiSettings, FiEdit3, FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';

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
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('list');

  // FETCH
  const fetchNotes = async () => {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .eq('is_archived', false)
        .eq('is_deleted', false);

      query = sortBy === 'created'
        ? query.order('created_at', { ascending: false })
        : query.order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [sortBy]);

  // SAVE
  const saveNote = async () => {
    if (!title || !content) return;

    try {
      if (editMode) {
        await supabase
          .from('notes')
          .update({ title, content, updated_at: new Date() })
          .eq('id', currentId);
      } else {
        await supabase.from('notes').insert([{ title, content }]);
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error.message);
    }
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
    try {
      await supabase
        .from('notes')
        .update({ is_pinned: !note.is_pinned })
        .eq('id', note.id);

      fetchNotes();
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  // ARCHIVE
  const archiveNote = async (id) => {
    try {
      await supabase
        .from('notes')
        .update({ is_archived: true })
        .eq('id', id);

      fetchNotes();
    } catch (error) {
      console.error("Error archiving note:", error.message);
    }
  };

  // DELETE
  const deleteNote = async (id) => {
    try {
      await supabase
        .from('notes')
        .update({ is_deleted: true })
        .eq('id', id);

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
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
    if (!search || !text) return text;

    const parts = text.split(new RegExp(`(${search})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase()
        ? <span key={i} className="bg-[#D85482]/20 text-[#D85482] px-1 rounded-md font-bold">{part}</span>
        : part
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] pb-28 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex justify-between items-center border-b border-gray-200">
        
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Catatan Hati</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase">
              MyLove I&L Messages
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-2">

              <button 
                onClick={() => setFilterLiked(!filterLiked)}
                className="flex gap-2 w-full p-2"
              >
                <FiHeart /> {filterLiked ? 'Semua' : 'Disukai'}
              </button>

              <button 
                onClick={() => navigate('/arsip')}
                className="flex gap-2 w-full p-2"
              >
                <FiArchive /> Arsip
              </button>

              <button 
                onClick={() => navigate('/pengaturan')}
                className="flex gap-2 w-full p-2"
              >
                <FiSettings /> Pengaturan
              </button>

            </div>
          )}
        </div>
      </header>

      {/* SEARCH */}
      <div className="px-6 mt-4">
        <div className="bg-white flex items-center px-4 py-3 rounded-xl border">
          <FiSearch className="mr-2" />
          <input
            placeholder="Cari..."
            className="w-full outline-none"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className={`px-6 mt-6 gap-4 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'flex flex-col'}`}>
        {filtered.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            highlight={highlight}
            onLike={toggleLike}
            onEdit={editNote}
            onArchive={archiveNote}
            onDelete={deleteNote}
          />
        ))}
      </div>

      {/* FLOAT BUTTON */}
      <div className="fixed bottom-24 right-6">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#2A4480] text-white p-4 rounded-xl"
        >
          <FiEdit3 />
        </button>
      </div>

      {/* MODAL */}
      <NoteModal
        show={showForm}
        onClose={resetForm}
        onSave={saveNote}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        editMode={editMode}
      />

    </div>
  );
};

export default Notes;