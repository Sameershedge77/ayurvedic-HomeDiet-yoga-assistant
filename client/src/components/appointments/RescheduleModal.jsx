import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

export default function RescheduleModal({ appointment, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReschedule = async () => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/appointments/${appointment.id}/reschedule`,
        { date, time }
      );

      onSuccess(); // refresh dashboard
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-md p-6"
      >
        <h2 className="text-xl font-semibold mb-1">
          Reschedule Appointment
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Patient: <strong>{appointment.patient_name}</strong>
        </p>

        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          />

          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border"
            >
              Cancel
            </button>

            <button
              onClick={handleReschedule}
              disabled={loading}
              className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
