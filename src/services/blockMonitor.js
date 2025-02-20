// src/services/blockMonitor.js
const UserSettings = require("../models/UserSettings");
const GroupSettings = require("../models/GroupSettings");

class BlockMonitor {
  constructor(client) {
    this.client = client;
    this.blockedUsers = new Set();
    this.blockedGroups = new Set();
    this.updateInterval = 60000; // Check every minute
    this.start();
  }

  async loadBlockedSettings() {
    const [users, groups] = await Promise.all([
      UserSettings.find({ isBlocked: true }),
      GroupSettings.find({ isBlocked: true }),
    ]);

    this.blockedUsers = new Set(users.map((u) => u.userId));
    this.blockedGroups = new Set(groups.map((g) => g.groupId));
  }

  isBlocked(id) {
    return this.blockedUsers.has(id) || this.blockedGroups.has(id);
  }

  async start() {
    await this.loadBlockedSettings();
    setInterval(() => this.loadBlockedSettings(), this.updateInterval);
  }
}

module.exports = BlockMonitor;
