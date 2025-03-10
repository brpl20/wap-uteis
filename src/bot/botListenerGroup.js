// src/bot/botListenerGroup.js
const axios = require("axios");

async function botListenerGroup(client, message, listenerGroupId) {
  try {
    if (!message.body || message.to !== listenerGroupId) return;
    
    console.log("Bot listener active!");
    const command = message.body.toLowerCase().trim();
    
    // Debug logging
    console.log("From Group Bot Listener on message_create on:")
    console.log({
      command
    });

    // Command handling
    switch (command) {
      case "!listgroups":
        await handleListGroups(client, message);
        break;
        
      case "!listinactive":
        // await handleListIgnoredGroups(client, message);
        console.log("TODO!");
        break;
        
      // Add help command
      case "!help":
        await client.sendMessage(message.from, 
          "Available commands:\n" +
          "!listgroups - Lists all all groups\n" +
          "!listinactive - Lists all inactive groups"
        );
        break;
    }
  } catch (error) {
    console.error("Error in bot listener:", error);
    console.error(error.stack);
  }
}

// Handler for listing groups
async function handleListGroups(client, message) {
  try {
    // Get active groups from API
    const response = await axios.get('http://localhost:3000/api/getActiveGroups');
    const groups = response.data;
    
    if (!groups || groups.length === 0) {
      await client.sendMessage(message.from, "No active groups found.");
      return;
    }
    
    // Format response
    let responseText = "*Active Groups:*\n\n";
    groups.forEach((group, index) => {
      responseText += `${index + 1}. ${group.name || 'Unnamed Group'} (${group.id})\n`;
    });
    
    await client.sendMessage(message.from, responseText);
  } catch (error) {
    console.error("Error fetching active groups:", error);
    await client.sendMessage(message.from, "Error fetching active groups. Please try again later.");
  }
}

module.exports = botListenerGroup;