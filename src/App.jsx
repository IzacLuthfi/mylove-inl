import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Splash Screen
import SplashScreen from './pages/SplashScreen';

// Pages - Utama
import Home from './pages/Home';

// Pages - Gallery
import Gallery from './pages/Gallery/Gallery';
import PengaturanGaleri from './pages/Gallery/Pengaturan';
import ArsipGaleri from './pages/Gallery/Arsip';
import BaruDihapus from './pages/Gallery/BaruDihapus';
import Brankas from './pages/Gallery/Brankas';

// Pages - Video
import Video from './pages/Video/Video';
import PengaturanVideo from './pages/Video/PengaturanVideo';
import ArsipVideo from './pages/Video/ArsipVideo';
import BarudihapusVideo from './pages/Video/BarudihapusVideo';
import BrankasVideo from './pages/Video/BrankasVideo';

// Pages - Planner
import Planner from './pages/Planner/Planner';
import PengaturanPlanner from './pages/Planner/PengaturanPlanner';
import Plandihapus from './pages/Planner/Plandihapus';
import FormPlanner from './pages/Planner/FormPlanner';
import EditPlan from './pages/Planner/EditPlan';

// Pages - Notes
import Notes from './pages/Notes/Notes';
import ArsipPesan from './pages/Notes/ArsipPesan';
import Pengaturan from './pages/Notes/Pengaturan';
import BarudihapusPesan from './pages/Notes/BarudihapusPesan';

function App() {
  // State untuk mengontrol tampilan Splash Screen
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] font-sans overflow-x-hidden selection:bg-[#D85482]/30">
      
      {/* Jika showSplash true, tampilkan Splash Screen. Jika selesai, tampilkan aplikasi utama */}
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <>
          {/* MAIN CONTENT */}
          <main className="pb-24 animate-fadeIn">
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Rute Galeri Foto */}
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/pengaturan" element={<PengaturanGaleri />} />
              <Route path="/gallery/arsip" element={<ArsipGaleri />} />
              <Route path="/gallery/barudihapus" element={<BaruDihapus />} />
              <Route path="/gallery/brankas" element={<Brankas />} />

              {/* Rute Sinema / Video */}
              <Route path="/video" element={<Video />} />
              <Route path="/video/pengaturan" element={<PengaturanVideo />} />
              <Route path="/video/arsip" element={<ArsipVideo />} />
              <Route path="/video/barudihapus" element={<BarudihapusVideo />} />
              <Route path="/video/brankas" element={<BrankasVideo />} />

              {/* Rute Date Planner */}
              <Route path="/planner" element={<Planner />} />
              <Route path="/planner/pengaturan" element={<PengaturanPlanner />} />
              <Route path="/planner/plandihapus" element={<Plandihapus />} />
              <Route path="/planner/form" element={<FormPlanner />} />
              <Route path="/planner/edit/:id" element={<EditPlan />} />

              {/* Rute Notes / Catatan */}
              <Route path="/notes" element={<Notes />} />
              {/* PERBAIKAN DI DUA BARIS BAWAH INI (tambah /notes di depannya) */}
              <Route path="/notes/arsip" element={<ArsipPesan />} />
              <Route path="/notes/pengaturan" element={<Pengaturan />} />
              <Route path="/notes/barudihapus" element={<BarudihapusPesan />} />
            </Routes>
          </main>

          {/* NAVBAR GLOBAL */}
          <Navbar />
        </>
      )}
      
    </div>
  );
}

export default App;