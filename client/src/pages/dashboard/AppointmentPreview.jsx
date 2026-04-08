import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";

const AppointmentPreview = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/doctors");
        if (res.data?.success) {
          // Show only top 2 doctors for preview
          setDoctors(res.data.data.slice(0, 2));
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="mt-12 bg-white/80 border rounded-3xl p-6 shadow-soft-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Consult Our Ayurvedic Doctors 🩺
          </h2>
          <p className="text-sm text-slate-600">
            Get professional guidance for personalised treatment
          </p>
        </div>

        <button
          onClick={() => navigate("/appointments")}
          className="text-sm text-emerald-600 hover:underline"
        >
          View all →
        </button>
      </div>

      {/* Doctor Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading specialist availability...</p>
        ) : doctors.length === 0 ? (
          <p className="text-sm text-slate-500">No doctors available right now.</p>
        ) : (
          doctors.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {doc.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {doc.specialty}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {doc.experience}
                  </span>
                  <span className="bg-green-100 text-green-700 font-medium px-2 py-0.5 text-[10px] rounded-full">
                    {doc.availability}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/appointments")}
                className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                Book
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default AppointmentPreview;
