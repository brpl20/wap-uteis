// src/bot/botListener.js
const axios = require("axios");

async function blockEntity(type, id, isGroup) {
  try {
    const response = await axios.post('http://localhost:3000/api/block', {
      id: id,
      type: isGroup ? 'group' : 'user',
      blockType: type
    });
    return response.data;
  } catch (error) {
    console.error('Error making block request:', error);
    throw error;
  }
}

async function botListener(client, message) {
  try {
    if (!message.body) return;

    const command = message.body.toLowerCase().trim();
    
    // Extract remote ID and check if it's a group
    const remoteId = message._data.id.remote;
    const isGroup = remoteId.endsWith('@g.us');
    
    // Get the participant ID if it's a group message
    const participantId = isGroup ? message._data.id.participant : remoteId;

    // Debug logging
    console.log("From Single Bot Listener on message_create:")
    console.log({
      command,
      remoteId,
      isGroup,
      participantId
    });

    switch (command) {
      case "sb": // Soft block
        if (isGroup) {
          await blockEntity("soft", remoteId, true);
          console.log(`✅ Group ${remoteId} has been soft blocked`);
        } else {
          await blockEntity("soft", participantId, false);
          console.log(`✅ User ${participantId} has been soft blocked`);
        }
        break;

      case "hb": // Hard block
        if (isGroup) {
          await blockEntity("hard", remoteId, true);
          console.log(`🚫 Group ${remoteId} has been hard blocked`);
        } else {
          await blockEntity("hard", participantId, false);
          console.log(`🚫 User ${participantId} has been hard blocked`);
        }
        break;
    }
  } catch (error) {
    console.error("Error in bot listener:", error);
    console.error(error.stack);
  }
}

module.exports = botListener;