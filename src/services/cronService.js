// src/services/cronService.js
const cron = require('node-cron');
const albumService = require('./albumService');

function scheduleAlbumSelection(client, notificationGroupId) {
  // Schedule for Monday 8:00 AM
  cron.schedule('0 8 * * 1', async () => {
    try {
      console.log("Running scheduled album selection...");
      const album = await albumService.getRandomAlbum();
      
      if (album) {
        const message = await formatAlbumMessage(album); // Make this call async
        const chat = await client.getChatById(notificationGroupId);
        await chat.sendMessage(message);
        console.log(`Sent album recommendation: ${album.album} by ${album.artist}`);
      } else {
        console.error("Failed to select an album");
      }
    } catch (error) {
      console.error("Error in scheduled album selection:", error);
    }
  }, {
    timezone: "America/Sao_Paulo" // Adjust to your timezone
  });
  
  console.log("Album selection scheduled for Monday 8:00 AM");
}

// Make this function async
async function formatAlbumMessage(album) {
  const albumCount = await albumService.getAlbumCount();
  return `*Album of the Week*\n\n` +
         `🎵 *${album.album}*\n` +
         `👤 ${album.artist}\n` +
         `📅 ${album.year}\n\n` +
         `${albumCount} albums remaining\n` +
         `Type !next for another recommendation`;
}

module.exports = {
  scheduleAlbumSelection
};