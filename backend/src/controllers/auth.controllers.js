import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import Company from "../models/company.model.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// --- REGISTER / SIGNUP (creates company + admin user) ---
export const register = async (req, res) => {
  try {
    const { name, email, password, companyName, currency } = req.body;

    if (!name || !email || !password || !companyName || !currency) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // Create company
    const company = await Company.create({
      name: companyName,
      currency,
      employees: [],
    });

    // Create Admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "Admin",
      company: company._id,
    });

    company.employees.push(user._id);
    await company.save();

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("company");

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company.name,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
