import React from 'react';

const NoteForm = ({ title, setTitle, content, setContent }) => {
  return (
    <>
      <input
        placeholder="Judul Catatan"
        className="w-full mb-4 px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-xl"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
        placeholder="Tuliskan sesuatu..."
        rows={5}
        className="w-full mb-6 px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-xl resize-none"
        value={content}
        onChange={(e)=>setContent(e.target.value)}
      />
    </>
  );
};

export default NoteForm;