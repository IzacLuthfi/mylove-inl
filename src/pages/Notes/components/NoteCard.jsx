import React from 'react';
import { FiHeart, FiEdit3, FiArchive, FiTrash2 } from 'react-icons/fi';

const NoteCard = ({ note, highlight, onLike, onEdit, onArchive, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-[#2A3A6A] leading-tight pr-2">
          {highlight(note.title || 'Tanpa Judul')}
        </h3>
        
        <div className="flex items-center gap-2.5 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-100">
          <button onClick={() => onLike(note)}>
            <FiHeart size={16} className={note.is_pinned ? 'text-[#D85482] fill-[#D85482]' : 'text-gray-400'} />
          </button>

          <button onClick={() => onEdit(note)}>
            <FiEdit3 size={16} className="text-gray-400 hover:text-blue-500" />
          </button>

          <button onClick={() => onArchive(note.id)}>
            <FiArchive size={16} className="text-gray-400 hover:text-yellow-500" />
          </button>

          <button onClick={() => onDelete(note.id)}>
            <FiTrash2 size={16} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3 line-clamp-3">
        {highlight(note.content)}
      </p>
    </div>
  );
};

export default NoteCard;