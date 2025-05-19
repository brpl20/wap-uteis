// src/bot/botListenerGroup.js (updated)
const axios = require("axios");
const albumService = require('../services/albumService');

async function botListenerGroup(client, message, listenerGroupId, apiPort) {
  try {
    if (!message.body || message.to !== listenerGroupId) return;
    
    console.log("Bot listener active!");
    const command = message.body.toLowerCase().trim();
    
    // Debug logging
    console.log("From Group Bot Listener on message_create on:")
    console.log({
      command,
      apiPort
    });

    // Command handling
    switch (command) {
      case "!listgroups":
        await handleListGroups(client, message, apiPort);
        break;
        
      case "!listinactive":
        // await handleListIgnoredGroups(client, message, apiPort);
        console.log("TODO!");
        break;
      
      case "!next":
        await handleNextAlbum(client, message);
        break;
        
      // Add help command
      case "!help":
        await client.sendMessage(message.from, 
          "Available commands:\n" +
          "!listgroups - Lists all all groups\n" +
          "!listinactive - Lists all inactive groups\n" +
          "!next - Get another album recommendation"
        );
        break;
    }
  } catch (error) {
    console.error("Error in bot listener:", error);
    console.error(error.stack);
  }
}

// Handler for next album
// Handler for next album in botListenerGroup.js
async function handleNextAlbum(client, message) {
  try {
    const album = await albumService.getRandomAlbum();
    
    if (!album) {
      await client.sendMessage(message.from, "Sorry, couldn't find an album recommendation.");
      return;
    }
    
    const albumCount = await albumService.getAlbumCount();
    const formattedMessage = 
      `*Album Recommendation*\n\n` +
      `🎵 *${album.album}*\n` +
      `👤 ${album.artist}\n` +
      `📅 ${album.year}\n\n` +
      `${albumCount} albums remaining\n` +
      `Type !next for another recommendation`;
    
    await client.sendMessage(message.from, formattedMessage);
    
  } catch (error) {
    console.error("Error getting next album:", error);
    await client.sendMessage(message.from, "Error getting album recommendation. Please try again later.");
  }
}

// Other handlers as before...

module.exports = botListenerGroup;