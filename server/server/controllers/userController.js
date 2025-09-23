import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Car from "../models/Car.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "change_this_secret", { expiresIn: "7d" });
};

const generateRandomPassword = (length = 12) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if ((!email && !phone) || !password) {
      const missing = [];
      if (!email && !phone) missing.push("email or phone");
      if (!password) missing.push("password");
      return res.status(400).json({ success: false, message: "Please fill all fields", missingFields: missing });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Build missingFields response
    const missing = [];
    if (!name || (typeof name === "string" && name.trim() === "")) missing.push("name");
    // require either email+password OR phone (so user can register by phone)
    if ((!email || email.trim() === "") && (!phone || phone.toString().trim() === "")) {
      missing.push("email or phone");
    }
    // if email provided, require password (unless phone provided and phone-only registration is intended)
    if (email && (!password || password.trim() === "")) missing.push("password");

    if (missing.length) {
      return res.status(400).json({ success: false, message: "Please fill all the fields", missingFields: missing });
    }

    // Check existing user by email or phone
    const existsQuery = [];
    if (email) existsQuery.push({ email });
    if (phone) existsQuery.push({ phone });
    const userExists = existsQuery.length ? await User.findOne({ $or: existsQuery }) : null;
    if (userExists) {
      return res.status(409).json({ success: false, message: "User already exists with provided email or phone" });
    }

    // If password not provided (phone-only registration), generate a secure random password
    const plainPassword = password && password.trim() !== "" ? password : generateRandomPassword(12);

    if (plainPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUserData = {
      name: name.trim()
    };
    if (email) newUserData.email = email.trim().toLowerCase();
    if (phone) newUserData.phone = phone.toString().trim();
    newUserData.password = hashedPassword;

    const user = await User.create(newUserData);
    const token = generateToken(user._id.toString());

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvaliable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
