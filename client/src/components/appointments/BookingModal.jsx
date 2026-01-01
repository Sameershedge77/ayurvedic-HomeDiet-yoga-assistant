import { motion } from "framer-motion";
import { useState } from "react";
import { getUser } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const COMMON_PROBLEMS = [
  "Back Pain",
  "Neck Pain",
  "Joint Pain",
  "Knee Pain",
  "Ankle Pain",
  "Cold",
  "Cough",
  "Fever",
  "Stress",
  "Anxiety",
  "Digestive Issues",
  "Constipation",
  "Acidity",
  "Headache",
  "Migraine",
  "Sleep Issues",
  "Immunity Boost",
  "Weight Management",
];

export default function BookingModal({ doctor, onClose }) {
  const user = getUser();

  // ✅ Correct variable
  const healthIssues = doctor?.healthIssues || [];

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    problem: healthIssues.length > 0 ? healthIssues[0] : "",
    severity: doctor?.severity || "Moderate",
    date: "",
    time: "",
    notes: "Based on my recent Ayurvedic recommendations",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  navigate("/payment", {
  state: {
    doctor,
    booking: {
      ...form,
      userId: user.id, // 🔥 IMPORTANT
    },
    amount: doctor.fee,
  },
});
};


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="
          bg-white rounded-3xl w-full max-w-md
          max-h-[90vh] overflow-y-auto
          shadow-2xl relative
        "
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>

          <h2 className="text-2xl font-semibold text-gray-800">
            Book Appointment
          </h2>
          <p className="text-sm text-gray-600">
            with <span className="font-medium">{doctor.name}</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* Doctor info */}
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {doctor.specialty}
              </p>
              <p className="text-xs text-gray-500">
                {doctor.experience}
              </p>
            </div>
          </div>

          {/* Name */}
          <input
            type="text"
            value={form.name}
            disabled
            className="w-full border rounded-xl px-4 py-2 bg-gray-100 text-gray-600"
          />

          {/* Email */}
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full border rounded-xl px-4 py-2 bg-gray-100 text-gray-600"
          />
          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2"
          />

          {/* ✅ Problem type (NOW WORKING) */}
          <select
            name="problem"
            value={form.problem}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2"
          >
            <option value="">Select problem</option>

            {/* Recommended health issues */}
            {healthIssues.map(issue => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}

            <option disabled>──────────</option>

            {/* Common problems */}
            {COMMON_PROBLEMS.map(problem => (
              <option key={problem} value={problem}>
                {problem}
              </option>
            ))}
          </select>

          {/* Severity */}
          <input
            type="text"
            value={form.severity}
            disabled
            className="w-full border rounded-xl px-4 py-2 bg-gray-100 text-gray-600"
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2"
          />

          {/* Time */}
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2"
          >
            <option value="">Select Time Slot</option>
            {TIME_SLOTS.map(slot => (
              <option key={slot}>{slot}</option>
            ))}
          </select>

          {/* Notes */}
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="2"
            className="w-full border rounded-xl px-4 py-2 text-sm"
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t rounded-b-3xl">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition"
          >
            Proceed to Payment →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
