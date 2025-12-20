import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const doctors = [
  {
    id: 1,
    name: "Dr. Anjali Verma",
    specialty: "Ayurvedic Physician",
    experience: "12+ years experience",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Dr. Raghav Kulkarni",
    specialty: "Panchakarma Specialist",
    experience: "8+ years experience",
    image: "https://i.pravatar.cc/150?img=12",
  },
];

const AppointmentPreview = () => {
  const navigate = useNavigate();

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
        {doctors.map((doc) => (
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
              <p className="text-xs text-slate-500">
                {doc.experience}
              </p>
            </div>

            <button
              onClick={() => navigate("/appointments")}
              className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Book
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default AppointmentPreview;
