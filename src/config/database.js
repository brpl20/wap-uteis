// config/database.js
const mongoose = require('mongoose');
const UserSettings = require('../models/UserSettings');
const GroupSettings = require('../models/GroupSettings');

async function loadBlockedEntities(blockedEntities) {
  try {
    console.log("Loading blocked entities from database...");

    // Load blocked users
    const blockedUsers = await UserSettings.find({ 
      isBlocked: true,
      blockType: { $in: ['soft', 'hard'] }
    });
    blockedUsers.forEach(user => {
      blockedEntities.users.set(user.userId, user.blockType);
    });
    console.log(`Loaded ${blockedUsers.length} blocked users`);

    // Load blocked groups
    const blockedGroups = await GroupSettings.find({ 
      isBlocked: true,
      blockType: { $in: ['soft', 'hard'] }
    });
    blockedGroups.forEach(group => {
      blockedEntities.groups.set(group.groupId, group.blockType);
    });
    console.log(`Loaded ${blockedGroups.length} blocked groups`);

    // Debug output
    console.log("\nCurrently Blocked Users:");
    blockedEntities.users.forEach((blockType, userId) => {
      console.log(`- ${userId}: ${blockType}`);
    });

    console.log("\nCurrently Blocked Groups:");
    blockedEntities.groups.forEach((blockType, groupId) => {
      console.log(`- ${groupId}: ${blockType}`);
    });

  } catch (error) {
    console.error("Error loading blocked entities:", error);
    throw error;
  }
}

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = {
  connectDatabase,
  loadBlockedEntities
};