import React, { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { 
  FiSearch, FiMoreVertical, FiStar, 
  FiArchive, FiSettings, FiEdit3, FiArrowLeft, FiHeart
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
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('bg-white'); 

  const [filterPinned, setFilterPinned] = useState(false);
  
  // PERBAIKAN: Ambil sortBy dari Pengaturan (Local Storage)
  const [sortBy, setSortBy] = useState(localStorage.getItem('notes_sortBy') || 'created');

  // FETCH
  const fetchNotes = async () => {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .eq('is_archived', false)
        .eq('is_deleted', false);

      // PERBAIKAN: Jika disortir berdasarkan edit, pakai updated_at
      query = sortBy === 'created'
        ? query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
        : query.order('is_pinned', { ascending: false }).order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Mengecek jika pengaturan berubah saat halaman difokuskan kembali
    const savedSort = localStorage.getItem('notes_sortBy') || 'created';
    setSortBy(savedSort);
    fetchNotes();
  }, [sortBy]);

  // SAVE / EDIT
  // SAVE / EDIT
  const saveNote = async () => {
    // 1. Cek apakah kosong
    if (!title || !content) {
      alert("Judul dan isi catatan manisnya jangan sampai kosong ya!");
      return;
    }

    try {
      if (editMode) {
        const { error } = await supabase
          .from('notes')
          .update({ title, content, bg_color: bgColor, updated_at: new Date().toISOString() })
          .eq('id', currentId);
          
        if (error) throw error; // Lempar error jika gagal
      } else {
        const { error } = await supabase
          .from('notes')
          .insert([{ title, content, bg_color: bgColor, updated_at: new Date().toISOString() }]);
          
        if (error) throw error; // Lempar error jika gagal
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error.message);
      // 2. Munculkan peringatan agar kita tahu kenapa gagal
      alert("Gagal menyimpan pesan: " + error.message); 
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setBgColor('bg-white');
    setShowForm(false);
    setEditMode(false);
    setCurrentId(null);
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setBgColor(note.bg_color || 'bg-white');
    setEditMode(true);
    setCurrentId(note.id);
    setShowForm(true);
  };

  // PIN / LIKE
  const togglePin = async (note) => {
    try {
      await supabase
        .from('notes')
        .update({ is_pinned: !note.is_pinned })
        .eq('id', note.id);
      fetchNotes();
    } catch (error) {
      console.error("Error pinning:", error.message);
    }
  };

  // ARCHIVE
  const archiveNote = async (id) => {
    try {
      await supabase.from('notes').update({ is_archived: true }).eq('id', id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error archiving note:", error.message);
    }
  };

  // DELETE
  const deleteNote = async (id) => {
    if(!window.confirm("Buang pesan ini?")) return;
    try {
      await supabase.from('notes').update({ is_deleted: true }).eq('id', id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  // FILTER & SEARCH
  let filtered = notes;
  if (filterPinned) {
    filtered = filtered.filter(n => n.is_pinned);
  }
  filtered = filtered.filter(n =>
    (n.title + n.content).toLowerCase().includes(search.toLowerCase())
  );

  // HIGHLIGHT TEXT
  const highlight = (text) => {
    if (!search || !text) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase()
        ? <span key={i} className="bg-[#D85482]/20 text-[#D85482] px-1 rounded-sm font-bold">{part}</span>
        : part
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] pb-28 font-sans selection:bg-[#D85482]/30">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex justify-between items-center border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Catatan Hati</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">
              MyLove I&L Messages
            </p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition-all ${showMenu ? 'bg-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}>
            <FiMoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                <button onClick={() => {setFilterPinned(!filterPinned); setShowMenu(false)}} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
                  <FiStar className={filterPinned ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} /> {filterPinned ? 'Semua Pesan' : 'Pesan Tersemat'}
                </button>
                <button onClick={() => navigate('/notes/arsip')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
                  <FiArchive className="text-gray-400" /> Arsip Pesan
                </button>
                <button onClick={() => navigate('/notes/pengaturan')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3 border-t border-gray-100">
                  <FiSettings className="text-gray-400" /> Pengaturan
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="px-6 mt-6">
        <div className="bg-white flex items-center px-5 py-3.5 rounded-2xl border border-gray-200 shadow-sm focus-within:border-[#D85482] focus-within:ring-1 focus-within:ring-[#D85482] transition-all">
          <FiSearch className="mr-3 text-gray-400" size={20} />
          <input
            placeholder="Cari pesan manis..."
            className="w-full outline-none text-sm font-medium text-[#2A3A6A] placeholder-gray-400 bg-transparent"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABS (Tampilan Manis) */}
      <div className="px-6 mt-6 flex gap-4 border-b border-gray-200 pb-0">
        <button onClick={() => setFilterPinned(false)} className={`pb-3 text-sm font-bold transition-all relative ${!filterPinned ? 'text-[#2A3A6A]' : 'text-gray-400 hover:text-[#2A3A6A]/70'}`}>
          Semua Pesan
          {!filterPinned && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D85482] rounded-t-full"></span>}
        </button>
        <button onClick={() => setFilterPinned(true)} className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-1 ${filterPinned ? 'text-[#2A3A6A]' : 'text-gray-400 hover:text-[#2A3A6A]/70'}`}>
          <FiStar size={14} className={filterPinned ? 'fill-yellow-400 text-yellow-400' : ''}/> Tersemat
          {filterPinned && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D85482] rounded-t-full"></span>}
        </button>
      </div>

      {/* DAFTAR CATATAN (Masonry CSS) */}
      <div className="px-6 mt-6">
        {loading ? (
           <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D85482]"></div></div>
        ) : filtered.length === 0 ? (
           <div className="py-20 text-center flex flex-col items-center justify-center">
             <div className="bg-gray-100 p-5 rounded-full mb-4">
               <FiEdit3 size={32} className="text-gray-400" />
             </div>
             <h4 className="font-bold text-[#2A3A6A] mb-1">Kotak Surat Kosong</h4>
             <p className="text-xs text-gray-500 font-medium">Belum ada catatan hati untuk ditampilkan.</p>
           </div>
        ) : (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                highlight={highlight}
                onPin={togglePin}
                onEdit={editNote}
                onArchive={archiveNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}
      </div>

      {/* FLOAT BUTTON TULIS SURAT */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#D85482] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 border-2 border-white"
        >
          <FiEdit3 size={24} />
        </button>
      </div>

      {/* MODAL FORM */}
      <NoteModal
        show={showForm}
        onClose={resetForm}
        onSave={saveNote}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        bgColor={bgColor}
        setBgColor={setBgColor}
        editMode={editMode}
      />

    </div>
  );
};

export default Notes;