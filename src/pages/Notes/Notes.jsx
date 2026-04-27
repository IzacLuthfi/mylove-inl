import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { 
  FiSearch, FiMoreVertical, FiHeart, 
  FiArchive, FiSettings, FiEdit3, FiTrash2, FiX, FiPlus, FiArrowLeft
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

  // SAVE (ADD / EDIT)
  const saveNote = async () => {
    if (!title || !content) return;

    try {
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

  // HIGHLIGHT PENCARIAN (Dipercantik dengan warna pink)
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
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] pb-28 font-sans relative selection:bg-[#D85482]/30">

      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Catatan Hati</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">MyLove I&L Messages</p>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-full transition-all ${showMenu ? 'bg-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <FiMoreVertical size={20} />
          </button>

          {/* Menu Dropdown */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                <button 
                  onClick={() => { setFilterLiked(!filterLiked); setShowMenu(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <FiHeart className={filterLiked ? "text-[#D85482] fill-[#D85482]" : "text-gray-400"} /> 
                  {filterLiked ? 'Tampilkan Semua' : 'Catatan Disukai'}
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <button 
                  onClick={() => navigate('/arsip')}
                  className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <FiArchive className="text-gray-400" /> Arsip Pesan
                </button>
                <button 
                  onClick={() => navigate('/pengaturan')}
                  className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <FiSettings className="text-gray-400" /> Pengaturan Catatan
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. SEARCH BAR */}
      <div className="px-6 mt-6">
        <div className="bg-white flex items-center px-4 py-3.5 rounded-2xl shadow-sm border border-gray-200 focus-within:border-[#D85482] focus-within:ring-1 focus-within:ring-[#D85482] transition-all">
          <FiSearch className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Cari kata-kata manis..."
            className="bg-transparent w-full outline-none text-sm text-[#2A3A6A] placeholder-gray-400 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 3. NOTES LIST/GRID */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400 px-6 text-center">
          <div className="bg-gray-100 p-5 rounded-full mb-4">
            <FiEdit3 size={32} className="text-gray-400" />
          </div>
          <p className="font-medium text-[#2A3A6A]">Belum ada catatan.</p>
          <p className="text-xs mt-1">Tekan tombol tambah untuk menulis pesan baru.</p>
        </div>
      ) : (
        <div className={`px-6 mt-6 gap-4 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'flex flex-col'}`}>
          {filtered.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#2A3A6A] leading-tight pr-2">
                  {highlight(note.title || 'Tanpa Judul')}
                </h3>
                
                {/* Action Icons */}
                <div className="flex items-center gap-2.5 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-100">
                  <button onClick={() => toggleLike(note)} className="active:scale-75 transition-transform">
                    <FiHeart size={16} className={note.is_pinned ? 'text-[#D85482] fill-[#D85482]' : 'text-gray-400 hover:text-[#D85482]'} />
                  </button>
                  <button onClick={() => editNote(note)} className="active:scale-75 transition-transform">
                    <FiEdit3 size={16} className="text-gray-400 hover:text-blue-500" />
                  </button>
                  <button onClick={() => archiveNote(note.id)} className="active:scale-75 transition-transform">
                    <FiArchive size={16} className="text-gray-400 hover:text-yellow-500" />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="active:scale-75 transition-transform">
                    <FiTrash2 size={16} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3 leading-relaxed whitespace-pre-wrap line-clamp-3">
                {highlight(note.content)}
              </p>
              
            </div>
          ))}
        </div>
      )}

      {/* 4. FLOATING ACTION BUTTON */}
      <div className="fixed bottom-24 right-6 z-30">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#2A4480] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#2A4480]/30 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
        >
          <FiEdit3 size={22} />
          <span className="text-xs font-bold uppercase tracking-wider pr-1">Tulis</span>
        </button>
      </div>

      {/* 5. MODAL FORM TULIS/EDIT CATATAN */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-[#2A3A6A]/40 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2A3A6A]">
                {editMode ? 'Edit Catatan' : 'Tulis Catatan Hati'}
              </h2>
              <button onClick={resetForm} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-[#2A3A6A] transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <input
              placeholder="Judul Catatan"
              className="w-full mb-4 px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#2A3A6A] font-medium focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] transition"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />

            <textarea
              placeholder="Tuliskan sesuatu yang manis di sini..."
              rows={5}
              className="w-full mb-6 px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#2A3A6A] focus:outline-none focus:border-[#D85482] focus:ring-1 focus:ring-[#D85482] transition resize-none"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
            />

            <button 
              onClick={saveNote}
              className="w-full bg-[#D85482] text-white font-bold py-3.5 rounded-xl hover:bg-[#c04770] transition shadow-md active:scale-95 flex justify-center items-center gap-2"
            >
              {editMode ? 'Simpan Perubahan' : 'Simpan Catatan'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Notes;