import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PaymentSuccess from "../components/payment/PaymentSuccess";
import { useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  const [tab, setTab] = useState("upi");

  if (!state) {
    navigate("/appointments");
    return null;
  }
  // console.log("Doctor object:", doctor);
  // console.log("Doctor ID:", doctor?.id);

  const { doctor, booking, amount } = state;
  const handlePaymentConfirmation = async () => {
  try {
    await axios.post("http://localhost:5000/api/appointments", {
      userId: booking.userId || booking.id, // adjust if needed
      doctorId: doctor.id,
      patientName: booking.name,
      patientEmail: booking.email,
      problem: booking.problem,
      severity: booking.severity,
      notes: booking.notes,
      date: booking.date,
      time: booking.time,
      amount: amount,
    });

    setPaid(true);
  } catch (err) {
    console.error(err);
    alert("Failed to save appointment. Please try again.");
  }
};
  if (paid) return <PaymentSuccess />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6"
      >
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Complete Payment
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Appointment with <b>{doctor.name}</b>
        </p>

        {/* Amount */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600">Amount to Pay</p>
          <p className="text-2xl font-bold text-green-700">₹{amount}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["upi", "card", "netbanking"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium ${
                tab === t
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t === "upi" && "UPI"}
              {t === "card" && "Card"}
              {t === "netbanking" && "Net Banking"}
            </button>
          ))}
        </div>

        {/* UPI */}
        {tab === "upi" && (
          <div className="border rounded-xl p-4 text-center">
            <img
              src="/qr.png"
              alt="UPI QR"
              className="w-44 mx-auto"
            />
            <p className="text-sm text-gray-600 mt-3">
              Scan & pay using Google Pay, PhonePe, Paytm or any UPI app
            </p>
            <p className="text-xs text-gray-500 mt-1">
              After payment, click the confirmation button below
            </p>
          </div>
        )}

        {/* Card */}
        {tab === "card" && (
          <div className="border rounded-xl p-4 space-y-3">
            <input
              placeholder="Card Number"
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="flex gap-3">
              <input
                placeholder="MM/YY"
                className="w-1/2 border rounded-lg px-3 py-2"
              />
              <input
                placeholder="CVV"
                className="w-1/2 border rounded-lg px-3 py-2"
              />
            </div>
            <input
              placeholder="Card Holder Name"
              className="w-full border rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500">
              * Card payment is disabled in demo mode
            </p>
          </div>
        )}

        {/* Net Banking */}
        {tab === "netbanking" && (
          <div className="border rounded-xl p-4 space-y-3">
            <select className="w-full border rounded-lg px-3 py-2">
              <option>Select Bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
            </select>
            <p className="text-xs text-gray-500">
              * Net banking is disabled in demo mode
            </p>
          </div>
        )}

        {/* Confirmation */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePaymentConfirmation}
          className="w-full bg-green-600 text-white py-3 rounded-full mt-6 font-medium hover:bg-green-700"
        >
          I Have Completed the Payment
        </motion.button>


        <p className="text-xs text-center text-gray-500 mt-3">
          Payment will be verified by clinic before confirmation
        </p>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 mt-4 block mx-auto hover:underline"
        >
          Cancel & Go Back
        </button>
      </motion.div>
    </div>
  );
}

// const handlePaymentConfirmation = async () => {
//   try {
//     await axios.post("http://localhost:5000/api/appointments", {
//       userId: booking.userId || booking.id, // adjust if needed
//       doctorId: doctor.id,
//       patientName: booking.name,
//       patientEmail: booking.email,
//       problem: booking.problem,
//       severity: booking.severity,
//       notes: booking.notes,
//       date: booking.date,
//       time: booking.time,
//       amount: amount,
//     });

//     setPaid(true);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to save appointment. Please try again.");
//   }
// };
