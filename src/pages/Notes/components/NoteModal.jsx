import React from 'react';
import { FiX, FiHeart } from 'react-icons/fi';
import NoteForm from './NoteForm';

const NoteModal = ({ show, onClose, onSave, title, setTitle, content, setContent, bgColor, setBgColor, editMode }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[#2A3A6A]/40 backdrop-blur-sm flex justify-center items-end sm:items-center animate-fade-in">
      
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
          <h2 className="text-xl font-bold text-[#2A3A6A] flex items-center gap-2">
            <FiHeart className="text-[#D85482] fill-[#D85482]/20" />
            {editMode ? 'Edit Pesan' : 'Tulis Pesan'}
          </h2>

          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <NoteForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          bgColor={bgColor}
          setBgColor={setBgColor}
        />

        <button
          onClick={onSave}
          className="w-full bg-[#D85482] hover:bg-[#c04770] text-white font-bold py-4 rounded-xl mt-6 transition-all shadow-lg shadow-[#D85482]/30 active:scale-95"
        >
          {editMode ? 'Simpan Perubahan' : 'Kirim Pesan'}
        </button>

      </div>
    </div>
  );
};

export default NoteModal;