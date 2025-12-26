import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { getUser, logout } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

const DoctorDashboard = () => {
  const user = getUser();
  const doctorId = user?.id; // demo doctor id (later from auth)
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;
    axios
      .get(`http://localhost:5000/api/doctors/${doctorId}/appointments`)
      .then(res => {
        setAppointments(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [doctorId]);

  const confirmAppointment = async (id) => {
    await axios.put(
      `http://localhost:5000/api/appointments/${id}/confirm`
    );

    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: "CONFIRMED" } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-ayur-gradient relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />
      <Navbar />

      <main className="relative max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-semibold text-slate-900"
            >
              Doctor Dashboard 🩺
            </motion.h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Welcome {user?.name || ""}. Review appointment requests, confirm
              consultations, and manage patient interactions.
            </p>
          </div>

          {/* <button
            onClick={logout}
            className="text-xs px-4 py-2 rounded-full border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition"
          >
            Log out
          </button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: "Pending Appointments",
              value: appointments.filter(a => a.status === "PENDING").length,
            },
            {
              title: "Confirmed Appointments",
              value: appointments.filter(a => a.status === "CONFIRMED").length,
            },
            {
              title: "Total Consultations",
              value: appointments.length,
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white/80 border border-emerald-50 p-5 shadow-soft-card"
            >
              <h3 className="text-xs text-slate-500 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Appointment Requests */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Appointment Requests
          </h2>

          {loading && (
            <p className="text-sm text-slate-600">Loading appointments...</p>
          )}

          {!loading && appointments.length === 0 && (
            <div className="rounded-2xl bg-white/70 border p-6 text-center text-slate-600">
              No appointment requests yet 🌿
            </div>
          )}

          <div className="space-y-4">
            {appointments.map((appt, index) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-white border p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Patient Info */}
                <div>
                  <p className="font-semibold text-slate-900">
                    {appt.patient_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {appt.problem} • {appt.appointment_date} •{" "}
                    {appt.appointment_time}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                      appt.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* Actions */}
                {appt.status === "PENDING" ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmAppointment(appt.id)}
                    className="self-start md:self-center bg-emerald-600 text-white px-5 py-2 rounded-full text-sm hover:bg-emerald-700 transition"
                  >
                    Confirm Appointment
                  </motion.button>
                ) : (
                  <span className="text-xs text-slate-500">
                    Meeting link sent to patient
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;
