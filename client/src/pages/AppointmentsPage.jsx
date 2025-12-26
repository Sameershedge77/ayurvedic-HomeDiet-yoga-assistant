import { doctors } from "../data/doctors";
import BookingModal from "../components/appointments/BookingModal";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const prefillData = location.state || {};
  const { healthIssues, severity } = prefillData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-10"
    >
      {/* Creative Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-md text-green-700 font-medium hover:shadow-lg transition"
      >
        ◀ Back to Dashboard
      </motion.button>

      {/* Header */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center text-green-800"
      >
        Connect with Certified Ayurvedic Doctors
      </motion.h1>

      <p className="text-center text-gray-600 mt-2">
        Get personalized consultation from qualified practitioners
      </p>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto">
        {doctors.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-2xl transition-all"
          >
            {/* Doctor Info */}
            <div className="flex items-center gap-4">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {doc.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {doc.specialty}
                </p>
                <p className="text-xs text-gray-500">
                  {doc.experience}
                </p>
              </div>
            </div>

            {/* Availability (Dynamic-looking) */}
            <div className="flex justify-between mt-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                {doc.availability}
              </span>
              <span className="bg-yellow-100 px-3 py-1 text-xs rounded-full">
                ⭐ {doc.rating}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {doc.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6">
              <span className="font-semibold text-gray-700">
                ₹{doc.fee}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setSelectedDoctor({
                    ...doc,
                    healthIssues,
                    severity
                  })
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition"
              >
                Book Consultation
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </motion.div>
  );
}
