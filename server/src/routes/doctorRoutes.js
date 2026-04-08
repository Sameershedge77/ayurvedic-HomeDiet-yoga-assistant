import express from "express";
import {
  getDoctorAppointments,
  confirmAppointment,
  getAllDoctorsWithAvailability
} from "../controllers/doctorController.js";

const router = express.Router();

// Get appointments for doctor
router.get("/doctors/:doctorId/appointments", getDoctorAppointments);

// Confirm appointment
router.put("/appointments/:appointmentId/confirm", confirmAppointment);

// Live availability
router.get("/public/doctors", getAllDoctorsWithAvailability);

export default router;
