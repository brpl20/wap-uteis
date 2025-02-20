// src/uteis/softBlock.js
// SoftBlockGroup:
async function archiveGroup(client, message, groupsToArchive, debug = false) {
  if (
    message.from.endsWith("@g.us") &&
    groupsToArchive.includes(message.from)
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
    let contact = await message.getContact();
    if (contact.isMyContact && spamToArchive.includes(message.from)) {
      let chat = await client.getChatById(message.from);
      await chat.archive();
      if (debug) {
        console.log("Chat archived:", message.from);
      }
    }
  } catch (error) {
    console.error("Error archiving chat:", error);
  }
}

module.exports = {
  archiveGroup,
  archiveChatSpam,
};
