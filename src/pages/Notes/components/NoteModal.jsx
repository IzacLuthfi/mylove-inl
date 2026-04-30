import React from 'react';
import { FiX } from 'react-icons/fi';
import NoteForm from './NoteForm';

const NoteModal = ({
  show,
  onClose,
  onSave,
  title,
  setTitle,
  content,
  setContent,
  editMode
}) => {

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2A3A6A]/40 flex justify-center items-end sm:items-center">
      
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2rem] p-7">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {editMode ? 'Edit Catatan' : 'Tulis Catatan'}
          </h2>

          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <NoteForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
        />

        <button
          onClick={onSave}
          className="w-full bg-[#D85482] text-white py-3 rounded-xl"
        >
          {editMode ? 'Simpan' : 'Tambah'}
        </button>

      </div>
    </div>
  );
};

export default NoteModal;