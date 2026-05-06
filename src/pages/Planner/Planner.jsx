import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient";
import { 
  FiArrowLeft, FiPlus, FiCalendar, FiClock, 
  FiMapPin, FiCheckCircle, FiTrash2, FiAlignLeft,
  FiMoreVertical, FiSettings, FiList, FiMap, FiShield,
  FiEdit2 // Tambahan ikon Edit
} from 'react-icons/fi';

const Planner = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const sortOrder = localStorage.getItem('planner_sortOrder') || 'newest';
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [activeDate, setActiveDate] = useState(today.getDate());

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('planners')
        .select('*')
        .eq('is_deleted', false) 
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  
  const calendarDates = Array.from({ length: daysInMonth }, (_, i) => {
    const dayDate = new Date(currentYear, currentMonth, i + 1);
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return {
      date: i + 1,
      dayName: dayNames[dayDate.getDay()],
      fullDateStr: dayDate.toISOString().split('T')[0]
    };
  });

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const handleScrollToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setActiveDate(today.getDate());
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'planned' ? 'done' : 'planned';
    try {
      await supabase.from('planners').update({ status: newStatus }).eq('id', id);
      setPlans(plans.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (error) {
      console.error("Gagal update status:", error.message);
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Pindahkan rencana ini ke Tempat Sampah?")) return;
    try {
      await supabase.from('planners').update({ is_deleted: true }).eq('id', id);
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error("Gagal menghapus:", error.message);
    }
  };

  let upcomingPlans = plans.filter(p => {
    const planDate = new Date(p.date);
    return p.status === 'planned' && planDate.getMonth() === currentMonth && planDate.getFullYear() === currentYear;
  });

  let completedPlans = plans.filter(p => p.status === 'done');

  if (sortOrder === 'newest') {
    upcomingPlans.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    completedPlans.sort((a, b) => new Date(b.date) - new Date(a.date)); 
  } else {
    upcomingPlans.sort((a, b) => new Date(b.date) - new Date(a.date));
    completedPlans.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 font-sans text-[#2A3A6A] selection:bg-[#D85482]/30 relative">
      
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-lg px-6 py-5 flex items-center justify-between border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-[#2A3A6A] active:scale-90 transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Date Planner</h1>
            <p className="text-[10px] text-[#D85482] font-bold uppercase tracking-wider">MyLove I&L Schedule</p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition-all ${showMenu ? 'bg-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}>
            <FiMoreVertical size={20} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fade-in">
                <button onClick={() => navigate('/planner/pengaturan')} className="w-full px-4 py-3 text-left text-sm text-[#2A3A6A] font-medium hover:bg-gray-50 flex items-center gap-3">
                  <FiSettings className="text-gray-400" /> Pengaturan Planner
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <section className="mt-6 px-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-[#2A3A6A] flex items-center gap-2">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button onClick={handleScrollToToday} className="text-xs text-[#D85482] font-bold bg-[#D85482]/10 hover:bg-[#D85482]/20 px-3 py-1.5 rounded-lg transition-colors active:scale-95">
            Hari Ini
          </button>
        </div>
        
        <div className="flex justify-between gap-3 overflow-x-auto scrollbar-hide pb-2 px-1">
          {calendarDates.map((item, index) => {
            const isToday = item.date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const hasPlan = plans.some(p => p.date === item.fullDateStr && p.status === 'planned');

            return (
              <button 
                key={index}
                onClick={() => setActiveDate(item.date)}
                className={`flex flex-col items-center min-w-[55px] p-3 rounded-2xl border transition-all active:scale-90 relative ${
                  activeDate === item.date 
                    ? 'bg-[#2A4480] border-[#2A4480] shadow-lg shadow-[#2A4480]/30 text-white transform -translate-y-1' 
                    : (isToday ? 'bg-[#D85482]/5 border-[#D85482]/30 text-[#D85482]' : 'bg-white border-gray-200 text-gray-500 hover:border-[#2A4480]/30 hover:bg-gray-50')
                }`}
              >
                <span className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${activeDate === item.date ? 'text-white/80' : ''}`}>
                  {item.dayName}
                </span>
                <span className={`text-xl font-bold ${activeDate === item.date ? 'text-white' : 'text-[#2A3A6A]'}`}>
                  {item.date}
                </span>
                {hasPlan && (
                  <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${activeDate === item.date ? 'bg-white' : 'bg-[#D85482]'}`}></span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="px-6 mt-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#2A4480] mb-5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D85482] animate-pulse"></span>
          Rencana Bulan Ini
        </h3>
        
        {loading ? (
           <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D85482]"></div></div>
        ) : upcomingPlans.length === 0 ? (
          <div className="text-center py-10 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <FiCalendar className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">Belum ada jadwal kencan di bulan ini.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {upcomingPlans.map((plan, index) => {
              const isNavy = index % 2 === 0;
              const bgColor = isNavy ? 'bg-[#2A4480]' : 'bg-[#D85482]';
              const textPrimary = 'text-white';
              const textSec = 'text-white/80';
              const iconBg = 'bg-white/20';

              return (
                <div key={plan.id} className={`${bgColor} p-6 rounded-[2rem] shadow-lg relative group transition-transform`}>
                  
                  {/* HEADER KARTU DENGAN TOMBOL EDIT */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${iconBg} ${textPrimary} backdrop-blur-sm shadow-sm`}>
                      <FiCalendar size={22} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleStatus(plan.id, plan.status)} className={`${textPrimary} bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors active:scale-90`} title="Tandai Selesai">
                        <FiCheckCircle size={18} />
                      </button>
                      <button onClick={() => navigate(`/planner/edit/${plan.id}`)} className={`${textPrimary} bg-white/10 hover:bg-blue-400/50 p-2 rounded-full transition-colors active:scale-90`} title="Edit Rencana">
                        <FiEdit2 size={18} />
                      </button>
                      <button onClick={() => deletePlan(plan.id)} className="text-white/50 hover:text-white bg-white/10 hover:bg-red-500/50 p-2 rounded-full transition-colors active:scale-90" title="Hapus Rencana">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h4 className={`font-bold text-2xl ${textPrimary} mb-2 leading-tight tracking-wide`}>
                    {plan.title}
                  </h4>
                  
                  {plan.description && (
                    <p className={`text-sm ${textSec} mb-4 flex items-start gap-2 italic`}>
                      <FiAlignLeft className="mt-1 flex-shrink-0" /> {plan.description}
                    </p>
                  )}
                  
                  {/* SUSUNAN ACARA (TIMELINE) */}
                  {plan.sub_plans && plan.sub_plans.length > 0 && (
                    <div className={`bg-white/10 rounded-2xl p-4 mb-4 ${textPrimary}`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 opacity-80">
                        <FiList /> Susunan Acara
                      </p>
                      <div className="flex flex-col gap-3">
                        {plan.sub_plans.map((ag, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="flex flex-col items-center mt-1">
                              <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>
                              {idx !== plan.sub_plans.length - 1 && <span className="w-0.5 h-full bg-white/30 my-1"></span>}
                            </div>
                            <div className="pb-3 flex-1">
                              <p className="font-bold text-sm leading-snug">{ag.activity}</p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 opacity-80 text-[10px] font-semibold">
                                {(ag.startTime || ag.endTime) && (
                                  <span className="flex items-center gap-1"><FiClock/> {ag.startTime || '..'} - {ag.endTime || '..'} WIB</span>
                                )}
                                {ag.location && (
                                  <span className="flex items-center gap-1"><FiMapPin/> {ag.location}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AGENDA CADANGAN (PLAN A, B) */}
                  {plan.backup_plans && plan.backup_plans.length > 0 && (
                    <div className="bg-white/95 rounded-2xl p-4 mb-4 text-[#2A3A6A] shadow-inner">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-[#D85482]">
                        <FiShield /> Agenda Cadangan
                      </p>
                      <div className="flex flex-col gap-2">
                        {plan.backup_plans.map((bp, idx) => (
                          <div key={idx} className="bg-gray-100 rounded-xl p-3">
                            <h5 className="font-bold text-xs text-[#2A4480]">Plan {String.fromCharCode(65 + idx)}: {bp.title}</h5>
                            {bp.description && <p className="text-[10px] text-gray-500 mt-1">{bp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* INFO UTAMA */}
                  <div className={`flex flex-col gap-2.5 text-sm ${textSec} font-medium bg-black/10 p-4 rounded-2xl mb-4`}>
                    <div className="flex items-center gap-3">
                      <FiClock size={16} className="shrink-0"/>
                      <span>{new Date(plan.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long'})} • {plan.time?.slice(0,5) || '-'} WIB</span>
                    </div>
                    {plan.location && (
                      <div className="flex items-center gap-3">
                        <FiMapPin size={16} className="shrink-0"/>
                        <span>{plan.location}</span>
                      </div>
                    )}
                  </div>

                  {/* GOOGLE MAPS IFRAME */}
                  {plan.map_iframe && (
                    <div className="mt-2 rounded-xl overflow-hidden aspect-video relative border border-white/20 shadow-inner bg-gray-200">
                       <div 
                         dangerouslySetInnerHTML={{ __html: plan.map_iframe }} 
                         className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                       />
                       <div className="absolute top-2 left-2 bg-white/80 backdrop-blur text-[#2A3A6A] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm pointer-events-none">
                         <FiMap /> Peta Lokasi
                       </div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </section>

      {completedPlans.length > 0 && (
        <section className="px-6 mt-10 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
            <FiCheckCircle size={16} /> Kenangan Terlewati (Done)
          </h3>
          
          <div className="flex flex-col gap-3">
            {completedPlans.map(plan => (
              <div key={plan.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-[#2A3A6A] line-through decoration-gray-300 decoration-2 opacity-70">
                    {plan.title}
                  </h4>
                  <p className="text-xs font-medium text-gray-400 mt-1">
                    {new Date(plan.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(plan.id, plan.status)} className="text-green-500 bg-green-50 p-2.5 rounded-full active:scale-90 transition-transform" title="Batal Selesai">
                    <FiCheckCircle size={20} />
                  </button>
                  <button onClick={() => deletePlan(plan.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => navigate('/planner/form')}
          className="bg-[#D85482] text-white p-4 rounded-[1.25rem] shadow-lg shadow-[#D85482]/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center border-2 border-white"
        >
          <FiPlus size={24} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
};

export default Planner;