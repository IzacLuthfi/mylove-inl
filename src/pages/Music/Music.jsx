import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FiArrowLeft, FiMusic, FiEdit3, FiInfo, FiHeart, 
  FiLink, FiShare2, FiMoreVertical, FiPlus, FiTrash2, FiDisc 
} from 'react-icons/fi';

const Music = () => {
  const navigate = useNavigate();
  
  // URL Default
  const defaultPlaylist = "https://open.spotify.com/embed/playlist/37i9dQZF1DX6mvYvSNApYo";
  const [mainPlaylist, setMainPlaylist] = useState(defaultPlaylist);
  const [folderPlaylists, setFolderPlaylists] = useState([]);

  // Muat data dari Local Storage
  useEffect(() => {
    const savedMain = localStorage.getItem('mylove_main_spotify');
    const savedFolder = localStorage.getItem('mylove_folder_spotify');
    
    if (savedMain) setMainPlaylist(savedMain);
    if (savedFolder) setFolderPlaylists(JSON.parse(savedFolder));
  }, []);

  // Fungsi konversi link biasa ke Embed
  const formatSpotifyUrl = (url) => {
    if (url.includes('spotify.com') && !url.includes('/embed/')) {
      return url.replace('spotify.com/', 'spotify.com/embed/').split('?')[0];
    }
    return url.split('?')[0];
  };

  // 1. Ubah Playlist Utama
  const handleEditMain = async () => {
    const { value: url } = await Swal.fire({
      title: 'Ubah Lagu Utama',
      input: 'url',
      inputLabel: 'Paste Link Playlist/Lagu Spotify',
      inputValue: mainPlaylist.replace('/embed/', '/'),
      footer: `
        <div style="text-align: left; font-size: 11px; color: #666; background: #f9f9f9; padding: 15px; border-radius: 15px; border: 1px dashed #ccc;">
          <b style="color: #D85482;">CARA SALIN LINK:</b><br>
          1. Buka Spotify & cari Playlist kalian.<br>
          2. Klik titik tiga <i class="fi fi-rr-menu-dots"></i> -> Share.<br>
          3. Pilih <b>Copy Link</b>.
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#2A4480',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (url) {
      const formatted = formatSpotifyUrl(url);
      setMainPlaylist(formatted);
      localStorage.setItem('mylove_main_spotify', formatted);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Berhasil diubah!', showConfirmButton: false, timer: 1500 });
    }
  };

  // 2. Tambah ke Folder Playlist
  const handleAddFolder = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Koleksi Playlist',
      html:
        '<input id="swal-input1" class="swal2-input" style="border-radius: 12px; font-size: 14px;" placeholder="Nama Koleksi (ex: Lagu Galau)">' +
        '<input id="swal-input2" class="swal2-input" style="border-radius: 12px; font-size: 14px;" placeholder="Paste Link Spotify">',
      footer: `
        <div style="text-align: left; font-size: 11px; color: #666; background: #f9f9f9; padding: 15px; border-radius: 15px; border: 1px dashed #ccc;">
          <b style="color: #D85482;">INFO:</b> Koleksi ini akan muncul di bawah sebagai daftar playlist tambahan kalian.
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#D85482',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      },
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (formValues && formValues[0] && formValues[1]) {
      const newPlaylist = {
        id: Date.now(),
        name: formValues[0],
        url: formatSpotifyUrl(formValues[1])
      };
      const updatedFolder = [newPlaylist, ...folderPlaylists];
      setFolderPlaylists(updatedFolder);
      localStorage.setItem('mylove_folder_spotify', JSON.stringify(updatedFolder));
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Koleksi ditambahkan!', showConfirmButton: false, timer: 1500 });
    }
  };

  // 3. Hapus Folder Item (DENGAN SWEETALERT)
  const deleteFolderItem = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus koleksi ini?',
      text: "Playlist ini akan dihapus dari daftar koleksi kalian.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D85482',
      cancelButtonColor: '#2A4480',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true, // Tombol batal di kiri
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) {
      const filtered = folderPlaylists.filter(item => item.id !== id);
      setFolderPlaylists(filtered);
      localStorage.setItem('mylove_folder_spotify', JSON.stringify(filtered));
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Koleksi dihapus!',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'rounded-2xl' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#2A3A6A] pb-32 selection:bg-[#D85482]/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-gray-100/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-[#2A4480]">Musik Kita</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-widest">Soundtrack of Us</p>
          </div>
        </div>
        <button onClick={handleEditMain} className="p-2.5 bg-[#2A4480]/10 text-[#2A4480] rounded-full active:scale-90 transition-all">
          <FiEdit3 size={20} />
        </button>
      </header>

      {/* 1. PEMUTAR UTAMA */}
      <section className="px-6 mt-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
           <div className="bg-[#D85482] p-1.5 rounded-lg text-white"><FiDisc className="animate-spin-slow" /></div>
           <h2 className="font-black text-lg">Lagu Favorit Utama</h2>
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-3 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <iframe 
            style={{ borderRadius: '2rem' }} 
            src={mainPlaylist} 
            width="100%" 
            height="450" 
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* 2. FOLDER PLAYLIST / KOLEKSI */}
      <section className="px-6 mt-12">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2">
              <div className="bg-[#2A4480] p-1.5 rounded-lg text-white"><FiMusic /></div>
              <h2 className="font-black text-lg">Koleksi Playlist</h2>
           </div>
           <button 
            onClick={handleAddFolder}
            className="bg-[#D85482] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-[#D85482]/30 active:scale-95 transition-all flex items-center gap-2"
           >
             <FiPlus strokeWidth={3} /> Tambah
           </button>
        </div>

        {folderPlaylists.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem]">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Belum ada koleksi tambahan</p>
          </div>
        ) : (
          <div className="space-y-8">
            {folderPlaylists.map((item) => (
              <div key={item.id} className="animate-fade-in">
                <div className="flex justify-between items-center mb-3 px-2">
                  <h3 className="font-bold text-sm flex items-center gap-2 text-[#2A4480]">
                    <FiHeart className="text-[#D85482] fill-[#D85482]" size={12} /> {item.name}
                  </h3>
                  
                  {/* Tombol Hapus dengan SweetAlert */}
                  <button onClick={() => deleteFolderItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <div className="bg-white rounded-[2rem] p-2 shadow-md border border-gray-100">
                  <iframe 
                    style={{ borderRadius: '1.5rem' }} 
                    src={item.url} 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Music;