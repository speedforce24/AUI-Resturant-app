const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role to "user"
    });

    await newUser.save();
    console.log("✅ User registered:", newUser); // Debugging log

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  console.log("🔹 Login route hit!"); // ✅ Log if route is reached
  console.log("📨 Received Data:", req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    console.log("🔍 Found User:", user); // ✅ Check if user exists

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ error: "User not found" });
    }

    // Ensure role is present
    if (!user.role) {
      console.log("⚠️ Warning: User role is missing for:", email);
      return res.status(500).json({ error: "Role not found for user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match for:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", email);
    console.log("🟢 Sending Login Response:", { token, role: user.role });

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      role: user.role  // ✅ Ensure role is sent
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
