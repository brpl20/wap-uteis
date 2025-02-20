// src/bot/botListener.js
const axios = require("axios");

async function blockUser(type, userId) {
  try {
    const response = await axios.post("http://localhost:3000/api/block", {
      id: userId,
      type: "user",
      blockType: type,
    });
    return response.data;
  } catch (error) {
    console.error("Error making block request:", error);
    throw error;
  }
}

async function botListener(client, message) {
  try {
    // Only process if it's a text message
    if (!message.body) return;

    const command = message.body.toLowerCase().trim();

    // Get the chat the message is replying to
    const quoted = await message.getQuotedMessage();
    if (!quoted) return;

    // Get the sender ID of the quoted message
    const targetUserId = quoted.from;

    switch (command) {
      case "sf":
        await blockUser("soft", targetUserId);
        await message.reply("✅ User has been soft blocked");
        break;

      case "hb":
        await blockUser("hard", targetUserId);
        await message.reply("🚫 User has been hard blocked");
        break;
    }
  } catch (error) {
    console.error("Error in bot listener:", error);
    message.reply("❌ Failed to process blocking command");
  }
}

module.exports = botListener;
