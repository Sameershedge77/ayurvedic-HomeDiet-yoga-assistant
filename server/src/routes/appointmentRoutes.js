import express from "express";
import {
  createAppointment,
  rescheduleAppointment,
  completeAppointment,
  rateAppointment,
} from "../controllers/appointmentController.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/appointments", createAppointment);
router.put("/appointments/:id/reschedule", rescheduleAppointment);
router.put("/appointments/:id/complete", completeAppointment);
router.post("/appointments/:id/rate", rateAppointment);

// Payment routes
router.post("/payments/create-order", createOrder);
router.post("/payments/verify", verifyPayment);

export default router;

