// client/src/pages/dashboard/UserDashboard.jsx
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { getUser } from "../../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AppointmentPreview from "../../components/appointments/AppointmentPreview";
import StepModal from "../../components/common/StepModal";
import TrustSignals from "../../components/ui/TrustSignals";
import { ArrowRight, Sparkles, Youtube, History, ClipboardCheck, Heart, Calendar } from "lucide-react";

const UserDashboard = () => {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [latestAppointment, setLatestAppointment] = useState(null);

  // Modal State
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // appointment section ref
  const apptRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#appointments" && apptRef.current) {
      apptRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const fetchLatestRecommendation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard/latest-recommendation/${user?.id}`
        );
        if (res.data.success) {
          setRecommendations(res.data.data);
        }
      } catch (err) {
        console.log("No recommendation found");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchLatestRecommendation();
    }
  }, [user]);

  useEffect(() => {
    const fetchLatestAppointment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${user?.id}/appointments`
        );
        if (res.data.success && res.data.data) {
          const appts = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          setAppointments(appts);
          setLatestAppointment(appts[0]);
        }
      } catch (err) {
        console.log("No appointments found");
      }
    };

    if (user?.id) {
      fetchLatestAppointment();
    }
  }, [user]);

  const handleOpenStep = (item, category) => {
    const imagePath = category === 'yoga'
      ? (item.image_keyword ? `/images/asanas/${item.image_keyword.split('/').pop()}` : null)
      : (item.image_keyword ? `/images/remedies/${item.image_keyword.split('/').pop()}` : null);

    setModalData({
      title: item.name,
      steps: item.steps,
      benefits: item.benefits,
      contraindications: item.contraindications || (category === 'ayurveda' ? item.usage : null),
      image: imagePath,
      duration: item.duration,
      usage: item.usage
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] relative overflow-hidden font-sans">
      <Navbar />

      <main className="relative max-w-5xl mx-auto px-6 pt-28 pb-20">

        {/* Row 1: Greeting & Main Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Dashboard</span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-bold text-slate-400 capitalize">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Namaste, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 text-base font-medium max-w-md leading-relaxed">
              Your personalized path to Ayurvedic balance and holistic wellbeing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/recommendation-history"
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-slate-600 px-5 py-3 rounded-xl font-bold text-[11px] transition-all shadow-sm"
            >
              <History size={16} className="text-emerald-600" /> VIEW HISTORY
            </Link>
            <button
              onClick={() => navigate("/assessment")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-[11px] transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5"
            >
              <ClipboardCheck size={16} /> NEW ASSESSMENT
            </button>
          </motion.div>
        </div>

        <div className="space-y-12">

          {/* Row 2: Status Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Health Status Card */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-700 opacity-60" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                  <Heart size={20} fill="currentColor" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight">My Profile</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                  Update your Dosha assessment regularly to align with your body&apos;s changing needs.
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 text-emerald-600 font-black text-[11px] uppercase tracking-widest group-hover:gap-4 transition-all w-fit"
                >
                  Update Now <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Upcoming Appointment */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-slate-900 rounded-3xl p-7 text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Calendar size={80} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">Consultation</span>
                </div>

                {latestAppointment ? (
                  <>
                    <h3 className="text-xl font-bold mb-1 tracking-tight group-hover:text-emerald-400 transition-colors">{latestAppointment.problem}</h3>
                    <p className="text-slate-400 text-xs mb-8 flex items-center gap-2 italic">
                      <Sparkles size={14} className="text-amber-500" />
                      {latestAppointment.appointment_date ? new Date(latestAppointment.appointment_date).toLocaleDateString() : "No Date"} @ {latestAppointment.appointment_time}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-1 tracking-tight">No Appointments</h3>
                    <p className="text-slate-400 text-xs mb-8 font-medium italic opacity-60">Speak with an Ayurvedic expert today.</p>
                  </>
                )}

                <button
                  onClick={() => navigate("/user-dashboard#appointments")}
                  className="w-full mt-auto py-3 bg-white/10 hover:bg-emerald-600 border border-white/10 hover:border-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                >
                  {latestAppointment ? "Manage Visits" : "Book Session"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Row 3: Ayurvedic Insights */}
          <div className="px-1">
            {!loading && recommendations ? (
              <div className="space-y-16">
                {/* Insights Banner */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/40 border border-emerald-50 relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Sparkles size={20} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ayurvedic Daily Focus</h2>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed font-bold mb-8 max-w-3xl">
                      &quot;{recommendations.summary}&quot;
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {recommendations.dosha_analysis && (
                        <div className="px-5 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] font-black border border-emerald-100 uppercase tracking-widest">
                          {recommendations.dosha_analysis}
                        </div>
                      )}
                      {recommendations.source === "STATIC_MAPPING" && (
                        <div className="px-5 py-2 bg-blue-50 text-blue-800 rounded-xl text-[10px] font-black border border-blue-100 uppercase tracking-widest">
                          Precision Mapping Enabled
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Yoga Section */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recommended Yoga</h3>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(recommendations.recommendations?.yoga || recommendations.yoga)?.map((yoga, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                      >
                        <div className="h-48 bg-slate-50 relative overflow-hidden">
                          {yoga.image_keyword ? (
                            <img src={`/images/asanas/${yoga.image_keyword.split('/').pop()}`} alt={yoga.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=Yoga"; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">Yoga Visual</div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="text-[8px] font-black text-white uppercase tracking-widest px-3 py-1.5 bg-emerald-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              SELECTED ASANA
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-black text-lg text-slate-900 tracking-tight">{yoga.name}</h4>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                              {yoga.reps_sets || yoga.duration || "5-10 MINS"}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed mb-6 flex-grow font-medium line-clamp-3">{yoga.benefits}</p>
                          <div className="mt-auto flex flex-col gap-2">
                            <button
                              onClick={() => handleOpenStep(yoga, 'yoga')}
                              className="w-full py-3 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              VIEW STEPS
                            </button>
                            {yoga.video && (
                              <a
                                href={yoga.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 rounded-xl text-red-600 text-[9px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 hover:bg-red-50"
                              >
                                <Youtube size={14} /> TUTORIAL
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Exercise & Ayurvedic Support Logic (Moved here) */}
                {(recommendations.recommendations?.exercise_do || recommendations.exercise_do || recommendations.recommendations?.ayurvedic_support || recommendations.ayurvedic_support) && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Exercise */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100"
                    >
                      <h3 className="text-xl font-black text-emerald-900 mb-6 tracking-tight flex items-center gap-2">
                        <ArrowRight size={20} /> Exercise Guidance
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/60 rounded-2xl border border-emerald-100 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Recommended Activity</h4>
                          <p className="text-sm font-bold text-emerald-900 leading-relaxed">
                            {recommendations.recommendations?.exercise_do || recommendations.exercise_do || "General mobility and walking."}
                          </p>
                        </div>
                        {(recommendations.recommendations?.exercise_dont || recommendations.exercise_dont) && (
                          <div className="p-4 bg-red-50/40 rounded-2xl border border-red-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">What to Avoid</h4>
                            <p className="text-sm font-bold text-red-900 leading-relaxed">
                              {recommendations.recommendations?.exercise_dont || recommendations.exercise_dont}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Ayurvedic Support */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-teal-50/50 rounded-3xl p-8 border border-teal-100"
                    >
                      <h3 className="text-xl font-black text-teal-900 mb-6 tracking-tight flex items-center gap-2">
                        <Sparkles size={20} /> Ayurvedic Support & Timing
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/60 rounded-2xl border border-teal-100 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-2">Support Options</h4>
                          <p className="text-sm font-bold text-teal-900 leading-relaxed">
                            {recommendations.recommendations?.ayurvedic_support || recommendations.ayurvedic_support || "Consult practitioner for herbal supports."}
                          </p>
                        </div>
                        <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100 italic">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">Timing & Dosage</h4>
                          <p className="text-sm font-bold text-amber-900">
                            {recommendations.recommendations?.support_timing || recommendations.support_timing || "Follow practitioner guidance."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Natural Remedies */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-8 bg-teal-600 rounded-full" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personalized Remedies</h3>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(recommendations.ayurveda || recommendations.remedies)?.map((remedy, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col group h-full"
                      >
                        <div className="h-44 shrink-0 relative overflow-hidden bg-emerald-50">
                          {remedy.image_keyword ? (
                            <img
                              src={`/images/remedies/${remedy.image_keyword.split('/').pop()}`}
                              alt={remedy.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300?text=Remedy"; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-emerald-200"><Heart size={24} /></div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20 shadow-sm">{remedy.type || "HERBAL"}</span>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h4 className="font-black text-lg text-slate-900 mb-1 tracking-tight">{remedy.name}</h4>
                          <p className="text-[10px] font-bold text-teal-600 mb-4 tracking-wide italic">
                            {remedy.frequency || remedy.dosage_timing || remedy.usage?.split('.')[0] || "Follow instructions"}
                          </p>
                          <div className="mt-auto flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                            <button
                              onClick={() => handleOpenStep(remedy, 'ayurveda')}
                              className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 uppercase tracking-widest"
                            >
                              GUIDE <ArrowRight size={14} />
                            </button>
                            {remedy.video && (
                              <a
                                href={remedy.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black text-red-600 hover:text-red-800 flex items-center gap-1.5 uppercase tracking-widest"
                              >
                                <Youtube size={14} /> VIDEO
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="grid lg:grid-cols-2 gap-6 pb-6">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#FFF9F2] rounded-3xl p-8 border border-orange-100 shadow-sm shadow-orange-100/10"
                  >
                    <h3 className="text-xl font-black text-orange-900 mb-6 tracking-tight">Dietary Guidelines</h3>
                    <div className="space-y-4">
                      {(recommendations.recommendations?.diet_do || recommendations.diet_do) ? (
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-emerald-500 rounded-full" />
                            <p className="text-xs font-bold text-emerald-800 leading-relaxed"><span className="text-emerald-900 uppercase text-[9px]">DO:</span> {recommendations.recommendations?.diet_do || recommendations.diet_do}</p>
                          </div>
                          {(recommendations.recommendations?.diet_dont || recommendations.diet_dont) && (
                            <div className="flex gap-3">
                              <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-red-400 rounded-full" />
                              <p className="text-xs font-bold text-red-800 leading-relaxed"><span className="text-red-900 uppercase text-[9px]">AVOID:</span> {recommendations.recommendations?.diet_dont || recommendations.diet_dont}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        (recommendations.dietTips || recommendations.recommendations?.diet_tips || recommendations.diet_tips)?.map((tip, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-orange-400 rounded-full" />
                            <p className="text-xs font-bold text-orange-800/80 leading-relaxed">{tip}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#F2F9FF] rounded-3xl p-8 border border-blue-100 shadow-sm shadow-blue-100/10"
                  >
                    <h3 className="text-xl font-black text-blue-900 mb-6 tracking-tight">Lifestyle Edits</h3>
                    <div className="space-y-4">
                      {(recommendations.recommendations?.lifestyle_do || recommendations.lifestyle_do) ? (
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-blue-500 rounded-full" />
                            <p className="text-xs font-bold text-blue-800 leading-relaxed"><span className="text-blue-900 uppercase text-[9px]">DO:</span> {recommendations.recommendations?.lifestyle_do || recommendations.lifestyle_do}</p>
                          </div>
                          {(recommendations.recommendations?.lifestyle_dont || recommendations.lifestyle_dont) && (
                            <div className="flex gap-3">
                              <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-amber-500 rounded-full" />
                              <p className="text-xs font-bold text-amber-800 leading-relaxed"><span className="text-amber-900 uppercase text-[9px]">AVOID:</span> {recommendations.recommendations?.lifestyle_dont || recommendations.lifestyle_dont}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        (recommendations.lifestyleTips || recommendations.recommendations?.lifestyle_tips || recommendations.lifestyle_tips)?.map((tip, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-blue-400 rounded-full" />
                            <p className="text-xs font-bold text-blue-800/80 leading-relaxed">{tip}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>


                {/* Frequency Plan & Safety */}
                <div className="flex flex-col md:flex-row gap-6">
                  {(recommendations.recommendations?.frequency_plan || recommendations.frequency_plan) && (
                    <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <Calendar size={14} /> Recommended Frequency
                      </h4>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                        {recommendations.recommendations?.frequency_plan || recommendations.frequency_plan}
                      </p>
                    </div>
                  )}
                  <div className="flex-1 bg-red-50/50 p-6 rounded-3xl border border-red-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-3">Safety Disclaimer</h4>
                    <p className="text-[11px] font-medium text-red-700 leading-relaxed">
                      {recommendations.safety_warning || "Consult a qualified practitioner before following remedies."}
                    </p>
                  </div>
                </div>

                {/* TRUST SIGNALS */}
                <TrustSignals />

              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 px-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardCheck className="text-emerald-200" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">No plan generated yet.</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium text-sm leading-relaxed">Let&apos;s build your path to wellness. The assessment only takes 3 minutes.</p>
                <button
                  onClick={() => navigate("/assessment")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all"
                >
                  START ASSESSMENT
                </button>
              </div>
            )}
          </div>

          <section ref={apptRef} className="pt-6 scroll-mt-24">
            <AppointmentPreview />
          </section>

        </div>

        <StepModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={modalData}
        />

      </main>
    </div>
  );
};

export default UserDashboard;
