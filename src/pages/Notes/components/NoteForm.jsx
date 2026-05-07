import React from 'react';

const NoteForm = ({ title, setTitle, content, setContent, bgColor, setBgColor }) => {
  
  // Konfigurasi Warna & Keterangan
  const colors = [
    { id: 'bg-white', name: 'Pesan', class: 'bg-white', border: 'border-gray-200' },
    { id: 'bg-pink', name: 'Quotes', class: 'bg-[#D85482]/10', border: 'border-[#D85482]/30' },
    { id: 'bg-gray', name: 'Pengingat', class: 'bg-gray-100', border: 'border-gray-300' },
    { id: 'bg-yellow', name: 'Catatan', class: 'bg-yellow-50', border: 'border-yellow-200' }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Pilihan Warna & Kategori */}
      <div className="mb-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">
          Pilih Kategori Surat
        </label>
        <div className="flex gap-4 items-center justify-between sm:justify-start sm:gap-6">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setBgColor(c.id)}
              className={`flex flex-col items-center gap-2 transition-all group ${bgColor === c.id ? 'scale-110' : 'opacity-60 hover:opacity-100 active:scale-95'}`}
            >
              <div 
                className={`w-9 h-9 rounded-full border-2 transition-all shadow-sm ${c.class} ${bgColor === c.id ? 'border-[#2A3A6A] shadow-md' : c.border}`}
              />
              <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${bgColor === c.id ? 'text-[#2A3A6A]' : 'text-gray-400'}`}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <input
        placeholder="Tuliskan judul di sini..."
        className="w-full px-5 py-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl font-bold text-[#2A3A6A] focus:outline-none focus:border-[#D85482] transition-colors shadow-sm"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
        placeholder="Curahkan isi hatimu..."
        rows={6}
        className="w-full px-5 py-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm text-[#2A3A6A] resize-none focus:outline-none focus:border-[#D85482] transition-colors leading-relaxed shadow-sm"
        value={content}
        onChange={(e)=>setContent(e.target.value)}
      />
    </div>
  );
};

export default NoteForm;