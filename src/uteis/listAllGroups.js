// src/uteis/listAllGroups.js
const listAllGroupsOrdered = async () => {
    try {
      const groups = await Group.find().sort({ lastMessage: -1 });
      console.log('All groups ordered by last message:', groups);
      return groups;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  };


  app.get('/api/getActiveGroups', async (req, res) => {
    try {
      const activeGroups = await getActiveGroups(client);
      res.json(activeGroups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API endpoint to get all groups (active and inactive)
  app.get('/api/getGroupChats', async (req, res) => {
    try {
      const groupChats = await getGroupChats(client);
      res.json(groupChats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });