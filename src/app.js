require("dotenv").config();
const { initializeWhatsAppClient } = require("./whatsapp/client");
const { connectDatabase, loadListenerGroup, loadBlockedEntities, ListenerGroupSettings } = require("./config/database");const { initializeAPI } = require("./api/server");
const { hardBlockUser, hardBlockGroup } = require("./uteis/hardBlock");
const { archiveGroup, archiveChatSpam } = require("./uteis/softBlock");
const botListener = require('./bot/botListener');  
const botListenerGroup = require('./bot/botListenerGroup');  


// Simple in-memory block tracking (alternative to MongoDB)
const blockedEntities = {
  users: new Map(), // userId -> blockType
  groups: new Map(), // groupId -> blockType
};

let listenerGroupId = null;


async function waitForClientReady(client) {
  const listenerGroup = await loadListenerGroup();
  listenerGroupId = listenerGroup ? listenerGroup.listenerGroupId : null;
  
  return new Promise((resolve) => {
    if (client.info) {
      // Client is already ready
      handleListenerGroup(client, listenerGroup).then(resolve);
    } else {
      // Wait for client to be ready
      client.on("ready", () => {
        console.log("WhatsApp client authenticated");
        console.log("WhatsApp client is ready!");
        console.log("listenergroup:");
        console.log(listenerGroup);
        const listenerGroupId = listenerGroup ? listenerGroup.listenerGroupId : null;
        console.log(listenerGroupId);
        
        handleListenerGroup(client, listenerGroup).then(resolve);
      });
    }
  });
}

async function handleListenerGroup(client, listenerGroup) {
  if (listenerGroup === null) {
    console.log("listenerGroupId is null - create new group and update mongodb");
    try {
      const createGroupResult = await client.createGroup(
        "BotManager" // Group title
      );
      const groupId = createGroupResult.gid._serialized;
      console.log("Group created with ID:", groupId);
      
      // save to mongo
      const newListenerGroup = new ListenerGroupSettings({
        listenerGroupId: groupId
      });
      
      await newListenerGroup.save();
      console.log("Group ID saved to MongoDB successfully");
      
      // Send welcome message to the new group
      const chat = await client.getChatById(groupId);
      await chat.sendMessage("Welcome to BotManager! This group will be used to manage bot operations.");
      
    } catch (error) {
      console.error("Error creating WhatsApp group:", error);
    }
  } else {
    console.log("Listener group already exists:", listenerGroup);
    // Continue with existing group
  }
}


async function startApplication() {
  try {
    console.log("Starting application...");

    // Initialize MongoDB connection
    console.log("Connecting to database...");
    await connectDatabase();
    await loadBlockedEntities(blockedEntities);


    console.log("Database connected successfully");

    // Initialize WhatsApp client
    console.log("Initializing WhatsApp client...");
    const client = await initializeWhatsAppClient();
    console.log("WhatsApp client initialized");

    // Wait for client to be fully ready
    await waitForClientReady(client);

    // Initialize API server
    console.log("Starting API server...");
    initializeAPI(client, blockedEntities);
    console.log("API server started");

    // Create Message handler with blocking logic
    // add id aqui! 
    client.on("message_create", async (message) => {
      const remoteId = message.id?.remote || message._data?.id?.remote;
      const targetRemoteId = listenerGroupId;

      if (remoteId === targetRemoteId) {
        try {
          console.log("Bot Working?");
          await botListenerGroup(client, message, listenerGroupId);
        } catch (error) {
          console.error("Error processing command:", error);
        }
      } else {
      try {
        await botListener(client, message);
      } catch (error) {
        console.error("Error processing command:", error);
      }
    }}
  );

    // Message handler with blocking logic
    client.on("message", async (message) => {
      try {
        const isGroup = message.from.endsWith("@g.us");
        const id = message.from;
        console.log(id);

        // Check if sender is blocked
        const blockType = isGroup
          ? blockedEntities.groups.get(id)
          : blockedEntities.users.get(id);

        if (blockType) {
          if (blockType === "soft") {
            if (isGroup) {
              await archiveGroup(client, message, blockedEntities.groups);
            } else {
              await archiveChatSpam(client, message, blockedEntities.users);
            }
          }
          return; // Skip processing blocked messages
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
    // At the start of startApplication():
    console.log("Initial blocked entities state:");
    console.log("Blocked users:", [...blockedEntities.users.entries()]);
    console.log("Blocked groups:", [...blockedEntities.groups.entries()]);
    console.log("Application started successfully");

    // Handle process termination
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      await cleanup();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received. Shutting down gracefully...");
      await cleanup();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

async function cleanup() {
  try {
    console.log("Cleaning up...");
    await mongoose.connection.close();
    console.log("Cleanup completed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  cleanup().then(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  cleanup().then(() => process.exit(1));
});

startApplication();
