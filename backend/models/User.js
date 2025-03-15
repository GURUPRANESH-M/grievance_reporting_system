const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff", "student"], default: "student" },
    name: { type: String }, // Optional name
  },
  { timestamps: true } // Add timestamps option
);

module.exports = mongoose.model("User", userSchema);