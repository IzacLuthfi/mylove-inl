import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pengaturan = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">

      <button onClick={()=>navigate(-1)} className="mb-4">
        ← Kembali
      </button>

      <h1 className="text-xl font-bold mb-6">Pengaturan</h1>

      {/* MENU */}
      <div className="flex flex-col gap-4">

        <button className="bg-white/10 p-3 rounded">
          🗑️ Pesan Dihapus
        </button>

        <div className="bg-white/10 p-3 rounded">
          <p className="mb-2">Tampilan Pesan</p>
          <button className="mr-2">List</button>
          <button>Grid</button>
        </div>

        <div className="bg-white/10 p-3 rounded">
          <p className="mb-2">Urutan Daftar</p>
          <button className="mr-2">Waktu Dibuat</button>
          <button>Waktu Diedit</button>
        </div>

      </div>

    </div>
  );
};

export default Pengaturan;