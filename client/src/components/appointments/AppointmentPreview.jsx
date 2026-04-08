import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Star, Clock, ArrowUpRight, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

export default function AppointmentPreview() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/doctors");
        if (res.data?.success) {
          setDoctors(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load doctors preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="mt-8 mb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-8 px-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Stethoscope size={14} />
            </div>
            <span className="text-[9px] font-black tracking-widest text-emerald-600 uppercase">Expert Consultations</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Book an Appointment
          </h2>
        </div>
        <button
          onClick={() => navigate("/appointments")}
          className="group flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-black text-[10px] uppercase tracking-widest transition-all"
        >
          View all doctors <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
        {loading ? (
          <p className="text-sm text-slate-500col-span-3 text-center py-10">Loading specialist availability...</p>
        ) : doctors.length === 0 ? (
          <p className="text-sm text-slate-500 col-span-3 text-center py-10">No doctors available right now.</p>
        ) : (
          doctors.map((doc, idx) => (
            <motion.div
              key={doc.id || idx}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full group-hover:scale-150 transition-transform duration-700 opacity-50" />

              <div className="relative z-10">
                {/* Availability Tag */}
                <div className="flex justify-between items-start mb-5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${doc.availability.toLowerCase() === 'available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                    <Clock size={10} /> {doc.availability}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-[9px] font-black text-slate-700">{doc.rating}</span>
                  </div>
                </div>

                {/* Doctor Profile */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                      <CheckCircle2 size={10} fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-0.5">{doc.name}</h3>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">{doc.specialty}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{doc.experience}</p>
                  </div>
                </div>

                {/* Tags Layer */}
                <div className="flex flex-wrap gap-1.5 mb-6 h-10 overflow-hidden">
                  {doc.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="bg-slate-50 text-slate-600 text-[8px] font-bold px-2 py-1 rounded-lg border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-100 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Area */}
                <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Consultation Fee</span>
                    <span className="text-lg font-black text-slate-900">₹{doc.fee}</span>
                  </div>
                  <button
                    onClick={() => navigate("/appointments")}
                    className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-100/10"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
