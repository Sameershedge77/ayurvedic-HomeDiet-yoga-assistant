import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.json()); // Removed duplicate line
app.use("/api", recommendationRoutes);
app.use("/api/auth", authRoutes);
app.use("/images", express.static("images"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/agents", agentRoutes);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;

app.get("/health", (req, res) => {
  res.send("Backend is healthy");
});

app.get("/api/test", (req, res) => {
  res.send("API is working");
});
