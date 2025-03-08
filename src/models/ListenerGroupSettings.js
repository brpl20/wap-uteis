// src/models/ListenerGroupSettings.js
const mongoose = require("mongoose");

const ListenerGroupSchema = new mongoose.Schema({
  listenerGroupId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ListenerGroupSettings", ListenerGroupSchema);
