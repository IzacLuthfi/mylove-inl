import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Splash Screen
import SplashScreen from './pages/SplashScreen';

// =========================
// LAZY LOAD PAGES
// =========================

// Music
const Music = lazy(() => import('./pages/Music/Music'));

// Pages - Utama
const Home = lazy(() => import('./pages/Home'));
const Profil = lazy(() => import('./pages/Profil'));
const Kenangan = lazy(() => import('./pages/Kenangan'));

// Pages - Gallery
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const PengaturanGaleri = lazy(() => import('./pages/Gallery/Pengaturan'));
const ArsipGaleri = lazy(() => import('./pages/Gallery/Arsip'));
const BaruDihapus = lazy(() => import('./pages/Gallery/BaruDihapus'));
const Brankas = lazy(() => import('./pages/Gallery/Brankas'));

// Pages - Video
const Video = lazy(() => import('./pages/Video/Video'));
const PengaturanVideo = lazy(() => import('./pages/Video/PengaturanVideo'));
const ArsipVideo = lazy(() => import('./pages/Video/ArsipVideo'));
const BarudihapusVideo = lazy(() => import('./pages/Video/BarudihapusVideo'));
const BrankasVideo = lazy(() => import('./pages/Video/BrankasVideo'));

// Pages - Planner
const Planner = lazy(() => import('./pages/Planner/Planner'));
const PengaturanPlanner = lazy(() => import('./pages/Planner/PengaturanPlanner'));
const Plandihapus = lazy(() => import('./pages/Planner/Plandihapus'));
const FormPlanner = lazy(() => import('./pages/Planner/FormPlanner'));
const EditPlan = lazy(() => import('./pages/Planner/EditPlan'));

// Pages - Notes
const Notes = lazy(() => import('./pages/Notes/Notes'));
const ArsipPesan = lazy(() => import('./pages/Notes/ArsipPesan'));
const Pengaturan = lazy(() => import('./pages/Notes/Pengaturan'));
const BarudihapusPesan = lazy(() => import('./pages/Notes/BarudihapusPesan'));

function App() {

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2A3A6A] font-sans overflow-x-hidden selection:bg-[#D85482]/30">

      {/* SPLASH SCREEN */}
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <>
          {/* MAIN CONTENT */}
          <main className="pb-24 animate-fadeIn">

            {/* SUSPENSE LOADING */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]">
                  <div className="flex flex-col items-center gap-4">

                    {/* LOADER */}
                    <div className="w-12 h-12 border-4 border-[#D85482] border-t-transparent rounded-full animate-spin"></div>

                    {/* TEXT */}
                    <p className="text-sm font-bold text-[#2A4480] tracking-wide">
                      Loading MyLove I&L 💙
                    </p>

                  </div>
                </div>
              }
            >

              <Routes>

                {/* Home */}
                <Route path="/" element={<Home />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/kenangan" element={<Kenangan />} />

                {/* Music */}
                <Route path="/music" element={<Music />} />

                {/* Gallery */}
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/pengaturan" element={<PengaturanGaleri />} />
                <Route path="/gallery/arsip" element={<ArsipGaleri />} />
                <Route path="/gallery/barudihapus" element={<BaruDihapus />} />
                <Route path="/gallery/brankas" element={<Brankas />} />

                {/* Video */}
                <Route path="/video" element={<Video />} />
                <Route path="/video/pengaturan" element={<PengaturanVideo />} />
                <Route path="/video/arsip" element={<ArsipVideo />} />
                <Route path="/video/barudihapus" element={<BarudihapusVideo />} />
                <Route path="/video/brankas" element={<BrankasVideo />} />

                {/* Planner */}
                <Route path="/planner" element={<Planner />} />
                <Route path="/planner/pengaturan" element={<PengaturanPlanner />} />
                <Route path="/planner/plandihapus" element={<Plandihapus />} />
                <Route path="/planner/form" element={<FormPlanner />} />
                <Route path="/planner/edit/:id" element={<EditPlan />} />

                {/* Notes */}
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/arsip" element={<ArsipPesan />} />
                <Route path="/notes/pengaturan" element={<Pengaturan />} />
                <Route path="/notes/barudihapus" element={<BarudihapusPesan />} />

              </Routes>

            </Suspense>

          </main>

          {/* NAVBAR */}
          <Navbar />
        </>
      )}

    </div>
  );
}

export default App;