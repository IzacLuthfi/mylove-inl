import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery/Gallery';
import Video from './pages/Video/Video';
import Planner from './pages/Planner/Planner';
import Notes from './pages/Notes/Notes';
import ArsipPesan from './pages/Notes/ArsipPesan';
import Pengaturan from './pages/Notes/Pengaturan';
import PengaturanGaleri from './pages/Gallery/Pengaturan';
import ArsipGaleri from './pages/Gallery/Arsip';
import BaruDihapus from './pages/Gallery/BaruDihapus';
import Brankas from './pages/Gallery/Brankas';
import PengaturanVideo from './pages/Video/PengaturanVideo';
import ArsipVideo from './pages/Video/ArsipVideo';
import BarudihapusVideo from './pages/Video/BarudihapusVideo';
import BrankasVideo from './pages/Video/BrankasVideo';

function App() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden selection:bg-pink-500/30">
      
      {/* MAIN CONTENT */}
      <main className="pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/video" element={<Video />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/arsip" element={<ArsipPesan />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/gallery/pengaturan" element={<PengaturanGaleri />} />
<Route path="/gallery/arsip" element={<ArsipGaleri />} />
<Route path="/gallery/barudihapus" element={<BaruDihapus />} />
<Route path="/gallery/brankas" element={<Brankas />} />
<Route path="/video/pengaturan" element={<PengaturanVideo />} />
<Route path="/video/arsip" element={<ArsipVideo />} />
<Route path="/video/barudihapus" element={<BarudihapusVideo />} />
<Route path="/video/brankas" element={<BrankasVideo />} />
        </Routes>
      </main>

      {/* NAVBAR GLOBAL */}
      <Navbar />
    </div>
  );
}

export default App;