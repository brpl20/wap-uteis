// src/models/GroupSettings.js
const mongoose = require("mongoose");

const groupSettingsSchema = new mongoose.Schema({
  groupId: {
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

module.exports = mongoose.model("GroupSettings", groupSettingsSchema);
