const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff", "student"], default: "student" }, // Added student to the enum
  // Remove or make name optional
  // name: { type: String, required: true }, //remove this line
  name: {type: String}, // or make it optional
});

module.exports = mongoose.model("User", userSchema);