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

  

useEffect(() => {
  axios
    .get(`http://localhost:5000/api/doctor/${user.id}/stats`)
    .then(res => setStats(res.data.data));
}, [user]);

useEffect(() => {
  const fetchStats = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/dashboard/doctor/${user.id}/stats`
    );

    if (res.data.success) {
      setStats(res.data.data);
    }
  };

  if (user?.id) fetchStats();
}, [user]);


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
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="Confirmed" value={stats.confirmed} color="green" />
          <StatCard title="Rescheduled" value={stats.rescheduled} color="blue" />
          <StatCard title="Total" value={stats.total} color="emerald" />
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Appointment Requests
          </h2>

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
                      {new Date(appt.appointment_date).toLocaleDateString()} •{" "}
                      {appt.appointment_time}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                      ${appt.status === "pending" && "bg-yellow-100 text-yellow-700"}
                      ${appt.status === "confirmed" && "bg-green-100 text-green-700"}
                      ${appt.status === "rescheduled" && "bg-blue-100 text-blue-700"}
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
                </div>
              </div>
            </motion.div>
          ))}
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
