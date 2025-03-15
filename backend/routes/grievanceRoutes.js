const express = require("express");
const router = express.Router();
const multer = require("multer");
const Grievance = require("../models/Grievance");
const authenticateUser = require("../middlewares/authMiddleware");
const mongoose = require("mongoose"); // Import mongoose

// 🖼 Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // Max 2MB

// ✅ Get all grievances
router.get("/", authenticateUser, async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch grievances" });
  }
});

// ✅ Submit a grievance (with optional image)
router.post("/", authenticateUser, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    console.log("Received Data:", req.body);
    console.log("Uploaded File:", req.file);

    if (!title || !description || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newGrievance = new Grievance({
      title,
      description,
      category,
      imageUrl,
      upvotes: 0,
      upvotedBy: [],
      user: new mongoose.Types.ObjectId(req.user.id), // Change here to ObjectId
    });

    await newGrievance.save();
    res.status(201).json({ message: "Grievance submitted successfully", grievance: newGrievance });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Failed to submit grievance" });
  }
});

// ✅ Upvote a grievance
router.post("/:id/upvote", authenticateUser, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id); // Change here to ObjectId
    const alreadyUpvoted = grievance.upvotedBy.some(id => id.equals(userId)); // Use .equals()

    if (alreadyUpvoted) {
      grievance.upvotedBy = grievance.upvotedBy.filter(uid => !uid.equals(userId)); // Use .equals()
      grievance.upvotes -= 1;
      await grievance.save();
      return res.json({ message: "Upvote removed", upvotes: grievance.upvotes });
    }

    grievance.upvotedBy.push(userId); // Use ObjectId
    grievance.upvotes += 1;
    await grievance.save();

    res.json({ message: "Upvoted", upvotes: grievance.upvotes });
  } catch (error) {
    console.error("Upvote error:", error); // Log the entire error object
    res.status(500).json({ error: "Failed to upvote grievance" });
  }
});

module.exports = router;