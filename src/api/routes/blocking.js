// /src/api/routes/blocking.js
const express = require("express");
const router = express.Router();
const UserSettings = require("../../models/UserSettings");
const GroupSettings = require("../../models/GroupSettings");
const { hardBlockUser, hardBlockGroup } = require("../../uteis/hardBlock");
const { archiveGroup, archiveChatSpam } = require("../../uteis/softBlock");

// Get blocked groups
router.get("/blocked-groups", async (req, res) => {
  try {
    const blockedGroups = await GroupSettings.find({ isBlocked: true });
    res.json(blockedGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get blocked users
router.get("/blocked-users", async (req, res) => {
  try {
    const blockedUsers = await UserSettings.find({ isBlocked: true });
    res.json(blockedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add block (user or group)
router.post("/block", async (req, res) => {
  try {
    const { id, type, blockType } = req.body; // type: 'user' or 'group', blockType: 'soft' or 'hard'

    if (!id || !type || !blockType) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const Model = type === "user" ? UserSettings : GroupSettings;
    const idField = type === "user" ? "userId" : "groupId";

    const settings = await Model.findOneAndUpdate(
      { [idField]: id },
      {
        isBlocked: true,
        blockType,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    // If it's a hard block, execute it immediately
    if (blockType === "hard") {
      const blockFunction = type === "user" ? hardBlockUser : hardBlockGroup;
      await blockFunction(req.client, id);
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this to your routes file
router.post("/unblock", async (req, res) => {
  try {
    const { id, type } = req.body; // type: 'user' or 'group'

    if (!id || !type) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (type === "user") {
      const chat = await client.getChatById(id);
      await chat.unblock();
    } else if (type === "group") {
      // For groups, we just remove the block status since we can't "rejoin" automatically
      await GroupSettings.findOneAndUpdate(
        { groupId: id },
        { isBlocked: false, blockType: "none", updatedAt: new Date() },
      );
    }

    res.json({ success: true, message: `${type} unblocked successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
