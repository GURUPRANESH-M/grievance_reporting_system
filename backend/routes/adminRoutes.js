const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Grievance = require("../models/Grievance"); // Ensure Grievance model is imported
const { authenticate, adminOnly } = require("../middlewares/authMiddleware"); // Import correct middleware

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Login successful!" });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   GET /api/admin/grievances
// @desc    Fetch all grievances (Only for admins)
// @access  Protected (Admin Only)
router.get("/grievances", authenticate, adminOnly, async (req, res) => {
  try {
    const grievances = await Grievance.find().populate("userId", "email");
    res.json(grievances);
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
