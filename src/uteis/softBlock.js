// src/uteis/softBlock.js
// SoftBlockGroup:
async function archiveGroup(client, message, groupsToArchive, debug = false) {
  if (
    message.from.endsWith("@g.us") &&
    groupsToArchive.has(message.from)  // Changed from includes to has
  ) {
    if (debug) {
      console.log("Group Message =>", message);
    }
    try {
      let chat = await client.getChatById(message.from);
      await chat.archive();
      if (debug) {
        console.log("Group archived:", message.from);
      }
    } catch (error) {
      console.error("Error archiving group:", error);
    }
  }
}
// SoftBlock Person
async function archiveChatSpam(client, message, spamToArchive, debug = false) {
  try {
    console.log(client);
    console.log(message);
    console.log(spamToArchive);
    let contact = await message.getContact();
    if (contact && spamToArchive.get(message.from) === 'soft') {
      let chat = await client.getChatById(message.from);
      await chat.archive();
      if (debug) {
        console.log("Chat archived:", message.from);
      }
    }
  } catch (error) {
    console.error("Error archiving chat:", error);
    console.error("Message from:", message.from);
  }
}

module.exports = {
  archiveGroup,
  archiveChatSpam,
};
