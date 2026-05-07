import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiPhone, FiMail, FiMapPin, FiLinkedin, FiX, FiCheck } from 'react-icons/fi';

import IzacImg from '../assets/Izac.png';
import LianImg from '../assets/Lian.png';

// --- DATA BAWAAN (DEFAULT) ---
const defaultData = {
  lian: {
    fullName: 'BRILIANTY SEKAR TAJI',
    address: 'Batang, Jawa Tengah',
    phone: '+62 85290214487',
    email: 'iamsekartajii18@gmail.com',
    linkedin: 'https://acesse.one/linkedinbrilianty',
    summary: 'Seorang mahasiswa aktif program studi Ilmu Perpustakaan dan informasi dengan minat besar dalam pengelolaan informasi, layanan perpustakaan, dan teknologi informasi. Memiliki komitmen untuk terus mengembangkan keterampilan komunikasi, organisasi, dan kepemimpinan melalui pengalaman magang dan kegiatan ekstrakurikuler. Saya bersemangat untuk menerapkan pengetahuan dan keterampilan saya dalam bidang perpustakaan serta berkontribusi dalam dunia literasi informasi.',
    education: 'Universitas Diponegoro Semarang, Indonesia\nS1 – Ilmu Perpustakaan dan Informasi | 2023 – Saat Ini\n• Aktif dalam organisasi Jentera Asa',
    experience: 'Perpustakaan SMAN 1 Batang – Batang, Indonesia\nAsisten Pustakawan | Jun – Ags 2024\n• Berhasil mengelola dan memperbarui catatan peminjaman dan pengembalian buku, serta membantu dalam proses inventarisasi koleksi.\n• Menyusun, merapikan, dan mengatur buku atau materi lainnya agar mudah diakses oleh pengguna perpustakaan.',
    organization: 'Jentera Asa\nKetua Divisi Education Development | Mei – Sep 2024\n• Merancang dan mengembangkan program-program pendidikan yang sesuai dengan visi dan misi Jentera Asa.\n• Memimpin dan mengkoordinasikan anggota divisi Education Development, memberikan pengarahan, serta mendukung pengembangan profesional tim.\n\nG-Fest\nStaff Divisi Acara | Jan 2024\n• Mengatur dan mempersiapkan logistik acara, termasuk tempat, perlengkapan, dan bahan yang diperlukan.',
    volunteer: 'KBSI Semarang\nVolunteer Pengajar | Mei – Jul 2024\n• Menyampaikan materi pembelajaran dengan cara yang efektif dan interaktif kepada peserta.\n• Berkolaborasi dengan pengajar lain dalam menjalankan program pendidikan.',
    certificates: '• Test of Proficiency in Korean (TOPIK) Level 2, Score: 153/200\n• Sertifikat Kepanitiaan Jentera ASA',
    skills: 'Bahasa – Indonesia (Natif), Inggris (Intermediate), Korean (Intermediate)\nSoft Skills – Manajemen Waktu, Kerja Tim, Disiplin, Komunikasi, Penyelesaian Masalah, Event Management, Kepemimpinan, Kreatif.\nHard Skills – Microsoft Office (Excel, Word, PowerPoint).'
  },
  izac: {
    fullName: 'IZAC LUTHFI PRANOWO',
    address: 'Cilacap, Jawa Tengah',
    phone: '+62 89620467214',
    email: 'izacluthfi12@gmail.com',
    linkedin: 'www.linkedin.com/in/izac-luthfi-pranowo-580349287',
    summary: 'Seorang mahasiswa aktif Program Studi Teknik Komputer dengan minat besar dalam pemrograman dan pengembangan web. Memiliki semangat, komitmen, dan antusiasme tinggi dalam mempelajari hal-hal baru di dunia komputer serta mencari berbagai pengalaman yang relevan. Berkomitmen untuk terus mengembangkan keterampilan komunikasi, organisasi, dan kepemimpinan melalui program magang dan kegiatan pendukung lainnya. Saya bersemangat untuk menerapkan pengetahuan dan keterampilan saya dalam bidang teknologi serta berkontribusi dalam pengembangan solusi perangkat lunak yang inovatif.',
    education: 'Universitas Diponegoro — Semarang, Indonesia\nS1 – Teknik Komputer | 2023 – Saat Ini\n• Aktif dalam organisasi Himpunan Mahasiswa Teknik Komputer\n• IPK 3.66',
    experience: 'PT DES Teknologi Informasi – Semarang\nPeserta Kerja Praktik | Jul 2025 – Agt 2025\n• Berpartisipasi dalam pembuatan aplikasi pengelolaan dokumen dan pengajuan komisi berbasis web.\n• Mempelajari implementasi API dan dasar pengembangan back end.\n• Mendapat pengalaman langsung dalam lingkungan kerja profesional di bidang teknologi informasi.',
    organization: 'OSIS SMAN 1 Jeruklegi\nKetua Umum | Agt 2021 – Sep 2022\n• Memimpin dan mengoordinasikan seluruh kegiatan OSIS secara strategis dan operasional.\n• Mengatur rapat, menyusun program kerja, serta memastikan pelaksanaannya berjalan efektif.\n\nHimpunan Mahasiswa Teknik Komputer\nStaff Muda Divisi Community Development | Agt 2024 – Mei 2025\n• Mendukung dan melaksanakan program sosial Divisi Community Development.\n\nKetua Divisi Community Development | Mei 2025 – Saat Ini\n• Memimpin dan mengkoordinasikan Divisi Community Development dari aspek SDM, SDA dan kegiatan.\n• Mengkoordinasikan komunikasi dan kegiatan sosial antara anggota komunitas dengan pihak internal maupun eksternal untuk memperkuat jaringan dan dukungan komunitas.',
    volunteer: '',
    certificates: '• Sertifikat Ketua OSIS SMAN 1 Jeruklegi 2021/2022\n• IT Essentials\n• CCNA: Introduction to Networks',
    skills: 'Bahasa – Indonesia (Natif), Inggris (Intermediate)\nSoft Skills – Manajemen Waktu, Komunikasi, Kepemimpinan, Kerja Sama Tim, Penyelesaian Masalah, Event Management, Ketekunan dan Kedisiplinan.\nHard Skills – Microsoft Office (Excel, Word, PowerPoint), Pemrograman (Python, PHP), Pengembangan Web (HTML, API, PWA, CSS), Database (MySQL), dan Mobile Development (Flutter, Android Studio).'
  }
};

const Profil = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lian'); // 'lian' atau 'izac'
  const [profiles, setProfiles] = useState(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Ambil data dari LocalStorage jika ada
  useEffect(() => {
    const savedData = localStorage.getItem('mylove_profiles');
    if (savedData) {
      setProfiles(JSON.parse(savedData));
    }
  }, []);

  // Saat tombol edit diklik, muat data tab aktif ke form
  const handleEditClick = () => {
    setEditForm({ ...profiles[activeTab] });
    setIsEditing(true);
  };

  // Saat form edit disimpan
  const handleSaveEdit = () => {
    const updatedProfiles = {
      ...profiles,
      [activeTab]: editForm
    };
    setProfiles(updatedProfiles);
    localStorage.setItem('mylove_profiles', JSON.stringify(updatedProfiles));
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const currentProfile = profiles[activeTab];
  const isLian = activeTab === 'lian';

  // Komponen Teks untuk render baris baru
  const RenderText = ({ text }) => {
    if (!text) return null;
    return <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{text}</p>;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#2A3A6A] pb-24 selection:bg-[#D85482]/30">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] hover:bg-gray-50 active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">Profil Kami</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-widest">Tentang Izac & Lian</p>
          </div>
        </div>
        
        <button onClick={handleEditClick} className="p-2.5 bg-[#2A4480]/10 text-[#2A4480] rounded-full active:scale-90 transition-all">
          <FiEdit3 size={20} />
        </button>
      </header>

      {/* 2. TABS NAVIGASI (LIAN / IZAC) */}
      <div className="flex justify-center mt-6 px-6">
        <div className="bg-gray-200/50 p-1.5 rounded-full flex gap-1 w-full max-w-sm">
          <button 
            onClick={() => setActiveTab('lian')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${isLian ? 'bg-white shadow-md text-[#D85482]' : 'text-gray-500'}`}
          >
            <img src={LianImg} alt="Lian" className={`w-6 h-6 rounded-full object-cover border ${isLian ? 'border-[#D85482]' : 'border-transparent'}`} /> Lian
          </button>
          <button 
            onClick={() => setActiveTab('izac')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${!isLian ? 'bg-white shadow-md text-[#2A4480]' : 'text-gray-500'}`}
          >
            <img src={IzacImg} alt="Izac" className={`w-6 h-6 rounded-full object-cover border ${!isLian ? 'border-[#2A4480]' : 'border-transparent'}`} /> Izac
          </button>
        </div>
      </div>

      {/* 3. KONTEN PROFIL */}
      <main className="px-6 mt-8 animate-fade-in">
        
        {/* Info Kontak & Header */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center mb-6">
          <img src={isLian ? LianImg : IzacImg} alt={currentProfile.fullName} className={`w-28 h-28 rounded-full object-cover shadow-lg mb-4 border-4 ${isLian ? 'border-[#D85482]/20' : 'border-[#2A4480]/20'}`} />
          <h2 className={`text-2xl font-black mb-1 ${isLian ? 'text-[#D85482]' : 'text-[#2A4480]'}`}>{currentProfile.fullName}</h2>
          
          <div className="flex flex-col gap-2 mt-4 text-xs font-medium text-gray-500 w-full bg-gray-50 p-4 rounded-2xl">
            <p className="flex items-center justify-center gap-2"><FiMapPin className={isLian ? 'text-[#D85482]' : 'text-[#2A4480]'} /> {currentProfile.address}</p>
            <p className="flex items-center justify-center gap-2"><FiPhone className={isLian ? 'text-[#D85482]' : 'text-[#2A4480]'} /> {currentProfile.phone}</p>
            <p className="flex items-center justify-center gap-2"><FiMail className={isLian ? 'text-[#D85482]' : 'text-[#2A4480]'} /> {currentProfile.email}</p>
            {currentProfile.linkedin && (
              <a href={currentProfile.linkedin.startsWith('http') ? currentProfile.linkedin : `https://${currentProfile.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-blue-500 hover:underline">
                <FiLinkedin /> LinkedIn Profil
              </a>
            )}
          </div>
        </div>

        {/* Section: Ringkasan */}
        {currentProfile.summary && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Ringkasan Profil</h3>
            <RenderText text={currentProfile.summary} />
          </div>
        )}

        {/* Section: Pendidikan */}
        {currentProfile.education && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Pendidikan</h3>
            <RenderText text={currentProfile.education} />
          </div>
        )}

        {/* Section: Pengalaman */}
        {currentProfile.experience && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Pengalaman</h3>
            <RenderText text={currentProfile.experience} />
          </div>
        )}

        {/* Section: Organisasi */}
        {currentProfile.organization && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Organisasi</h3>
            <RenderText text={currentProfile.organization} />
          </div>
        )}

        {/* Section: Volunteer */}
        {currentProfile.volunteer && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Volunteer</h3>
            <RenderText text={currentProfile.volunteer} />
          </div>
        )}

        {/* Section: Sertifikat */}
        {currentProfile.certificates && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Sertifikat & Pelatihan</h3>
            <RenderText text={currentProfile.certificates} />
          </div>
        )}

        {/* Section: Skills */}
        {currentProfile.skills && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLian ? 'text-[#D85482] border-[#D85482]/20' : 'text-[#2A4480] border-[#2A4480]/20'}`}>Kemampuan (Skills)</h3>
            <RenderText text={currentProfile.skills} />
          </div>
        )}

      </main>

      {/* --- MODAL EDIT PROFIL --- */}
      {isEditing && editForm && (
        <div className="fixed inset-0 z-[100] bg-[#2A3A6A]/60 backdrop-blur-sm flex justify-center items-end sm:items-center">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 rounded-t-[2rem] z-10">
              <h3 className="text-lg font-bold text-[#2A3A6A]">Edit Profil {isLian ? 'Lian' : 'Izac'}</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"><FiX size={20}/></button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nama Lengkap</label>
                <input type="text" value={editForm.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#2A3A6A] focus:outline-none focus:border-[#D85482] transition" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Alamat</label>
                  <input type="text" value={editForm.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Telepon</label>
                  <input type="text" value={editForm.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Link LinkedIn</label>
                <input type="text" value={editForm.linkedin} onChange={(e) => handleInputChange('linkedin', e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition" />
              </div>

              <hr className="border-gray-100 my-2" />

              {[
                { key: 'summary', label: 'Ringkasan Profil' },
                { key: 'education', label: 'Pendidikan' },
                { key: 'experience', label: 'Pengalaman' },
                { key: 'organization', label: 'Organisasi' },
                { key: 'volunteer', label: 'Volunteer' },
                { key: 'certificates', label: 'Sertifikat' },
                { key: 'skills', label: 'Skills' },
              ].map(section => (
                <div key={section.key}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{section.label}</label>
                  <textarea 
                    value={editForm[section.key]} 
                    onChange={(e) => handleInputChange(section.key, e.target.value)} 
                    rows={4} 
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D85482] transition resize-y leading-relaxed" 
                  />
                </div>
              ))}

            </div>

            <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0 rounded-b-[2rem]">
              <button onClick={handleSaveEdit} className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 active:scale-95 ${isLian ? 'bg-[#D85482] hover:bg-[#c04770] shadow-[#D85482]/30' : 'bg-[#2A4480] hover:bg-[#1f3360] shadow-[#2A4480]/30'}`}>
                <FiCheck size={20} /> Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profil;