import React from 'react';

const NoteForm = ({ title, setTitle, content, setContent, bgColor, setBgColor }) => {
  
  const colors = [
    { id: 'bg-white', name: 'Putih' },
    { id: 'bg-pink', name: 'Pink' },
    { id: 'bg-navy', name: 'Navy' },
    { id: 'bg-yellow', name: 'Kuning' }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Pilihan Warna */}
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Pilih Kertas Surat</label>
        <div className="flex gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setBgColor(c.id)}
              className={`w-8 h-8 rounded-full border-2 transition-all active:scale-90 ${c.id === 'bg-white' ? 'bg-white' : c.id === 'bg-pink' ? 'bg-[#D85482]/20' : c.id === 'bg-navy' ? 'bg-[#2A4480]/20' : 'bg-yellow-100'} ${bgColor === c.id ? 'border-[#2A3A6A] scale-110 shadow-md' : 'border-gray-200'}`}
            />
          ))}
        </div>
      </div>

      <input
        placeholder="Judul Catatan Manis..."
        className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-xl font-bold text-[#2A3A6A] focus:outline-none focus:border-[#D85482] transition-colors"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
        placeholder="Tuliskan isi hatimu di sini..."
        rows={6}
        className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-sm text-[#2A3A6A] resize-none focus:outline-none focus:border-[#D85482] transition-colors leading-relaxed"
        value={content}
        onChange={(e)=>setContent(e.target.value)}
      />
    </div>
  );
};

export default NoteForm;