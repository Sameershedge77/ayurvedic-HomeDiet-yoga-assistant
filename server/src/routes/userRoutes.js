import express from "express";
import { getUserAppointments } from "../controllers/userController.js";

const router = express.Router();

router.get("/users/:userId/appointments", getUserAppointments);

export default router;
