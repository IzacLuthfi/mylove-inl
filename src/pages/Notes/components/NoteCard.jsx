import React, { useState } from 'react';
import { FiStar, FiEdit3, FiArchive, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';

const NoteCard = ({ note, highlight, onPin, onEdit, onArchive, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Kumpulan tema warna
  const themeColors = {
    'bg-white': 'bg-white border-gray-100 text-[#2A3A6A]',
    'bg-pink': 'bg-[#D85482]/10 border-[#D85482]/20 text-[#D85482]',
    'bg-navy': 'bg-[#2A4480]/10 border-[#2A4480]/20 text-[#2A4480]',
    'bg-yellow': 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const cardTheme = themeColors[note.bg_color] || themeColors['bg-white'];

  return (
    <div className={`break-inside-avoid ${cardTheme} border p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all relative group`}>
      
      {/* Icon Pin Kiri Atas */}
      <button onClick={() => onPin(note)} className="absolute top-4 right-4 z-10 transition-transform active:scale-75">
        <FiStar size={20} className={note.is_pinned ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-black/10 hover:text-yellow-400'} />
      </button>

      <h3 className="font-bold text-lg mb-2 pr-6 leading-tight">
        {highlight(note.title || 'Tanpa Judul')}
      </h3>
      
      <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
        {highlight(note.content)}
      </p>

      {/* Footer Kartu & Menu Aksi */}
      <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center relative">
        <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
          {new Date(note.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>

        <button onClick={() => setShowOptions(!showOptions)} className="p-1 opacity-50 hover:opacity-100">
          <FiMoreHorizontal size={18} />
        </button>

        {showOptions && (
          <div className="absolute right-0 bottom-8 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 flex gap-1 z-20 animate-fade-in">
            <button onClick={() => {onEdit(note); setShowOptions(false)}} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit3 size={16} /></button>
            <button onClick={() => {onArchive(note.id); setShowOptions(false)}} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"><FiArchive size={16} /></button>
            <button onClick={() => {onDelete(note.id); setShowOptions(false)}} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;