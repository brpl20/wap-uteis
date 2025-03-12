// src/api/routes/listing.js
const express = require("express");
const router = express.Router();

router.get('/api/getActiveGroups', async (req, res) => {
  try {
    const activeGroups = await getActiveGroups(client);
    res.json(activeGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get all groups (active and inactive)
router.get('/api/getGroupChats', async (req, res) => {
  try {
    const groupChats = await listAllGroupsOrdered(client);
    res.json(groupChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
