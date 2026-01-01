// client/src/pages/dashboard/UserDashboard.jsx
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { getUser } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AppointmentPreview from "../../components/appointments/AppointmentPreview";

const UserDashboard = () => {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [latestAppointment, setLatestAppointment] = useState(null);


  // appointment section ref
  const apptRef = useRef(null);

  /* scroll to appointment section if hash exists */
  useEffect(() => {
    if (location.hash === "#appointments" && apptRef.current) {
      apptRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  /* fetch latest recommendation */
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

  /* fetch latest appointment */
  /* fetch latest appointment */
useEffect(() => {
  const fetchLatestAppointment = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/${user?.id}/appointments`
      );

      if (res.data.success && res.data.data) {
        setLatestAppointment(res.data.data);
      }
    } catch (err) {
      console.log("No appointments found");
    }
  };

  if (user?.id) {
    fetchLatestAppointment();
  }
}, [user]);


  return (
    <div className="min-h-screen bg-ayur-gradient relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />
      <Navbar />

      <main className="relative max-w-6xl mx-auto px-4 pt-24 pb-20">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Hi {user?.name}, welcome back 🌿
          </h1>
          <p className="text-sm text-slate-600">
            Your personal Ayurvedic wellness dashboard
          </p>
        </div>

        {/* Start Assessment */}
        
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Health Assessment */}
            <div className="bg-white/80 rounded-3xl p-6 shadow-soft-card">
              <h2 className="text-lg font-semibold mb-1">
                Health Assessment
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Answer a few questions to get personalised diet, yoga and remedies.
              </p>

              <button
                onClick={() => navigate("/assessment")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full"
              >
                Start Assessment
              </button>
            </div>

            {/* Appointment Status */}
            {/* Appointment Status (only if booked) */}
            {latestAppointment && (
                <div className="bg-white/80 rounded-3xl p-6 shadow-soft-card flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Appointment Status
                    </h2>

                    <p className="text-sm text-slate-700 font-medium">
                      {latestAppointment.problem}
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      {latestAppointment.appointment_date} •{" "}
                      {latestAppointment.appointment_time}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 text-xs rounded-full w-fit
                        ${latestAppointment.status === "pending" && "bg-yellow-100 text-yellow-700"}
                        ${latestAppointment.status === "confirmed" && "bg-green-100 text-green-700"}
                        ${latestAppointment.status === "rescheduled" && "bg-blue-100 text-blue-700"}
                      `}
                    >
                      {latestAppointment.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-4">
                    You’ll be notified by email if the doctor updates this appointment.
                  </p>
                </div>
              )}

          </div>

       

        {/* Latest Recommendation */}
        {!loading && recommendations && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Your Latest Recommendation 🌱
            </h2>

            {/* Summary */}
            <div className="bg-white/80 rounded-2xl p-5 border mb-6">
              <p className="text-sm text-slate-700">
                <strong>Health Issues:</strong> {recommendations.healthIssues}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Lifestyle:</strong>{" "} {recommendations.lifestyle || "Not specified"}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Severity:</strong>{" "} {recommendations.severity || "Not specified"}
              </p>
            </div>

            {/* Yoga Section */}
            <h3 className="text-xl font-semibold mb-3">
              🧘 Yoga to Practice Daily
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {recommendations.yoga?.map((yoga, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border hover:shadow-md transition"
                >
                  <img
                    src={yoga.image || "https://via.placeholder.com/150"}
                    alt={yoga.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-slate-900">
                    {yoga.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {yoga.benefits}
                  </p>

                  {yoga.video && (
                    <a
                      href={yoga.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 mt-2 inline-block hover:underline"
                    >
                      ▶ Watch guided video
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Remedies Section */}
            <h3 className="text-xl font-semibold mb-3">
              🌿 Ayurvedic Home Remedies
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.remedies?.map((remedy, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border hover:shadow-md transition"
                >
                  <img
                    src={remedy.image || "https://via.placeholder.com/150"}
                    alt={remedy.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-slate-900">
                    {remedy.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {remedy.usage || "Use as per Ayurvedic guidance"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Ingredients: {remedy.ingredients}
                  </p>
                  <p className="text-xs text-slate-500">
                    Prep time: {remedy.preparation_time}
                  </p>
                  {remedy.video && (
                    <a
                      href={remedy.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 mt-2 inline-block hover:underline"
                    >
                      ▶ Watch preparation video
                    </a>
                  )}

                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/recommendation-history")}
                className="px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                View Full Recommendation
              </button>
            </div>
          </motion.section>
        )}

        {/* Appointment Preview */}
        <section ref={apptRef}>
          <AppointmentPreview />
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
