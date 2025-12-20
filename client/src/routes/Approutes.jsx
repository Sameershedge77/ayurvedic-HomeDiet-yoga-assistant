import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/Registerpage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";

import UserDashboard from "../pages/dashboard/UserDashboard.jsx";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import RoleRoute from "../components/auth/RoleRoute.jsx";
import AssessmentPage from "../pages/dashboard/AssessmentPage.jsx";
import AppointmentsPage from "../pages/AppointmentsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />

      {/* User dashboard */}
      <Route
        path="/user-dashboard"
        element={<ProtectedRoute>
          <RoleRoute allowed={["user"]}>
            <UserDashboard />
          </RoleRoute>
        </ProtectedRoute>} />
      <Route
        path="/assessment"
        element={<ProtectedRoute>
          <RoleRoute allowed={["user"]}>
            <AssessmentPage />
          </RoleRoute>
        </ProtectedRoute>} />

      {/* Doctor dashboard */}
      <Route
        path="/doctor-dashboard"
        element={<ProtectedRoute>
          <RoleRoute allowed={["doctor"]}>
            <DoctorDashboard />
          </RoleRoute>
        </ProtectedRoute>} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Fallback: if someone still uses /dashboard, send them to user dashboard */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute>
          <RoleRoute allowed={["user"]}>
            <UserDashboard />
          </RoleRoute>
        </ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;
