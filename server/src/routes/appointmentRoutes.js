import express from "express";
import {
  createAppointment,
  rescheduleAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/appointments", createAppointment);
router.put("/appointments/:id/reschedule", rescheduleAppointment);

export default router;

