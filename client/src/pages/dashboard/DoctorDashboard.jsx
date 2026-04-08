import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { getUser } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "../../components/appointments/RescheduleModal";

const DoctorDashboard = () => {
  const user = getUser();
  const doctorId = user?.id;

  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    total: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Patient history lookup state
  const [searchEmail, setSearchEmail] = useState("");
  const [patientHistory, setPatientHistory] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const StatCard = ({ title, value, color }) => (
    <div className="bg-white rounded-2xl p-5 shadow border">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );


  const fetchAppointments = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/doctors/${doctorId}/appointments`
    );
    setAppointments(res.data.data || []);
  };

  useEffect(() => {
    if (doctorId) fetchAppointments();
  }, [doctorId]);

  const confirmAppointment = async (id) => {
    await axios.put(
      `http://localhost:5000/api/appointments/${id}/confirm`
    );
    fetchAppointments();
  };

  const completeAppointment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/complete`);
      fetchAppointments();
      setSuccessMessage("Appointment marked as completed! Patient has been emailed a rating link.");
      setTimeout(() => setSuccessMessage(""), 5000); // Clear after 5 seconds
    } catch (err) {
      console.error(err);
      alert("Failed to complete appointment."); // Keep alert for error, or you can use error state
    }
  };




  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard/doctor/${user.id}/stats`
        );
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    if (user?.id) fetchStats();
  }, [user]);

  const fetchPatientHistory = async () => {
    if (!searchEmail) return;
    setSearchLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard/recommendation-history/undefined?email=${searchEmail}`
      );
      if (res.data.success) {
        setPatientHistory(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch patient history", err);
    } finally {
      setSearchLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-ayur-gradient">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-semibold mb-2">
          Doctor Dashboard 🩺
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Welcome {user?.name}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Pending" value={stats.pending || 0} color="yellow" />
          <StatCard title="Confirmed" value={stats.confirmed || 0} color="green" />
          <StatCard title="Rescheduled" value={stats.rescheduled || 0} color="blue" />
          <StatCard title="Total" value={stats.total || 0} color="emerald" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Appointment Requests
            </h2>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-100 mb-6 flex justify-between items-center shadow-sm">
              <span className="font-medium">✅ {successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="text-emerald-500 hover:text-emerald-700">
                ✖
              </button>
            </div>
          )}

          {appointments.map(appt => (
            <motion.div
              key={appt.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 mb-4 shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {appt.patient_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    📧 {appt.patient_email}
                  </p>
                  <p className="text-sm text-gray-600">
                    📞 {appt.patient_phone || "N/A"}
                  </p>

                  {/* <p className="text-sm mt-1">
                    {appt.problem} • {appt.appointment_time}
                  </p> */}
                  <p className="text-sm text-gray-600">
                    {appt.problem} •{" "}
                    {appt.appointment_date ? new Date(appt.appointment_date).toLocaleDateString() : "No Date"} •{" "}
                    {appt.appointment_time}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-bold
                      ${appt.status.toLowerCase() === "pending" && "bg-yellow-100 text-yellow-700"}
                      ${appt.status.toLowerCase() === "confirmed" && "bg-green-100 text-green-700"}
                      ${appt.status.toLowerCase() === "rescheduled" && "bg-blue-100 text-blue-700"}
                      ${(appt.status.toLowerCase() !== "pending" && appt.status.toLowerCase() !== "confirmed" && appt.status.toLowerCase() !== "rescheduled") && "bg-slate-100 text-slate-700"}
                    `}
                  >
                    {appt.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-2">
                  {appt.status === "pending" && (
                    <>
                      <button
                        onClick={() => confirmAppointment(appt.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-full"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => setSelectedAppt(appt)}
                        className="border px-4 py-2 rounded-full"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {appt.status.toLowerCase() === "confirmed" && (
                    <button
                      onClick={() => completeAppointment(appt.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium shadow-sm transition-colors"
                    >
                      Done ✓
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Patient History Lookup 🔍
            </h2>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter patient email"
                className="flex-1 md:w-64 border rounded-xl px-4 py-2 focus:outline-emerald-500"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button
                onClick={fetchPatientHistory}
                disabled={!searchEmail || searchLoading}
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {!searchLoading && patientHistory.length > 0 && (
            <div className="space-y-8">
              {patientHistory.map((rec) => (
                <div key={rec.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-4 border-b pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        Assessment from {new Date(rec.createdAt).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Issues: {rec.healthIssues}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.severity === 'Severe' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {rec.severity}
                    </span>
                  </div>

                  {rec.summary && (
                    <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      "{rec.summary}"
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                        🧘 Yoga Recommendations
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {rec.yoga.map((y, i) => (
                          <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-700">
                              {i + 1}
                            </div>
                            <span className="text-xs font-medium text-slate-700 truncate">{y.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                        🌿 Ayurvedic Remedies
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {rec.remedies.map((r, i) => (
                          <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-700">
                              {i + 1}
                            </div>
                            <span className="text-xs font-medium text-slate-700 truncate">{r.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searchLoading && patientHistory.length === 0 && searchEmail && hasSearched && (
            <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">No history found for this patient.</p>
            </div>
          )}
        </section>
      </main>

      {selectedAppt && (
        <RescheduleModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onSuccess={fetchAppointments}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
