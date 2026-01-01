import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use("/api", recommendationRoutes);
app.use("/api/auth", authRoutes);
app.use("/images", express.static("images"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
app.get("/health", (req, res) => {
  res.send("Backend is healthy");
});

app.get("/api/test", (req, res) => {
  res.send("API is working");
});
