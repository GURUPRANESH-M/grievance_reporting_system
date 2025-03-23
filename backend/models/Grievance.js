const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["Personal", "Campus Environment"] },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  upvotedBy: { type: [String], default: [] }, // Store user IDs as Strings
});

module.exports = mongoose.model("Grievance", grievanceSchema);
