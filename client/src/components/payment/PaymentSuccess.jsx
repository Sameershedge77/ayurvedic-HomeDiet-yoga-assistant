import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md"
      >
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold text-green-700 mb-2">
          Payment Successful
        </h2>
        <p className="text-gray-600 mb-6">
          Your appointment has been booked successfully.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
