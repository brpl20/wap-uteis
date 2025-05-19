// src/uteis/listAllGroups.js
const listAllGroupsOrdered = async (client) => {
  try {
    // Get all chats using getChats() method
    const chats = await client.getChats();
    
    // Filter to only include groups
    const groups = chats.filter(chat => chat.isGroup);
    
    // Sort groups by last message timestamp (descending)
    const sortedGroups = groups.sort((a, b) => {
      const timestampA = a.lastMessage ? a.lastMessage.timestamp : 0;
      const timestampB = b.lastMessage ? b.lastMessage.timestamp : 0;
      return timestampB - timestampA;
    });
    
    console.log('All groups ordered by last message:', sortedGroups);
    return sortedGroups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

// Export the function
module.exports = { listAllGroupsOrdered };