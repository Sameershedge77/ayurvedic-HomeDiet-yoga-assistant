import express from "express";
import {
  getDoctorAppointments,
  confirmAppointment
} from "../controllers/doctorController.js";

const router = express.Router();

// Get appointments for doctor
router.get("/doctors/:doctorId/appointments", getDoctorAppointments);

// Confirm appointment
router.put("/appointments/:appointmentId/confirm", confirmAppointment);

export default router;
