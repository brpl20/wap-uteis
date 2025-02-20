// src/uteis/hardBlock.js
async function hardBlockGroup(client, groupId) {
  try {
    const chat = await client.getChatById(groupId);
    await chat.leave();

    await GroupSettings.findOneAndUpdate(
      { groupId },
      { isBlocked: true, updatedAt: new Date() },
      { upsert: true },
    );

    return true;
  } catch (error) {
    console.error("Error in hard blocking group:", error);
    throw error;
  }
}
// HardBlock Person
async function hardBlockUser(client, userId) {
  try {
    const chat = await client.getChatById(userId);
    await chat.block();

    await UserSettings.findOneAndUpdate(
      { userId },
      { isBlocked: true, updatedAt: new Date() },
      { upsert: true },
    );

    return true;
  } catch (error) {
    console.error("Error in hard blocking user:", error);
    throw error;
  }
}

module.exports = {
  hardBlockGroup,
  hardBlockUser,
};
