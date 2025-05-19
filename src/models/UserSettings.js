// src/models/UserSettings.js
const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockType: {
    type: String,
    enum: ["soft", "hard", "none"],
    default: "none",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserSettings", userSettingsSchema);
