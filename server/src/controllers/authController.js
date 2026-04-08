import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, inviteCode } = req.body;

    // Verify doctor invite code if role is doctor
    if (role === 'doctor') {
      const validCode = process.env.DOCTOR_INVITE_CODE || "AYURVEDA2026";
      if (!inviteCode || inviteCode !== validCode) {
        return res.status(400).json({ message: "Invalid Doctor Invite Code." });
      }
    }

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create(name, email, hashed, role);

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

import nodemailer from "nodemailer";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);

    if (!user) return res.json({ message: "If account exists, reset link sent." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send email (we configure Gmail later)
    res.json({ message: "Reset link sent.", resetLink });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
