// scripts/addSoftBlockedGroups.js
require('dotenv').config({ path: '../.env' }); // Try to locate the .env file in the parent directory
const mongoose = require('mongoose');
const GroupSettings = require('../models/GroupSettings');

async function insertSoftBlockedGroups() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Groups to insert
    const groupsToInsert = [
      { groupId: "554598348305-1615315456@g.us", description: "Vida Boa", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554196471313-1423336861@g.us", description: "Azevedo?", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "120363060055517738@g.us", description: "OAB?", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554584055504-1524233311@g.us", description: "Condomínio Rui Barbosa", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554599028844-1552607301@g.us", description: "Comissão Previdenciário", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "120363046101723117@g.us", description: "Italiano", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554599730657-1463102809@g.us", description: "Promoções Cerveja", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "120363026473260237@g.us", description: "Ação Edu Eduarda", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554588221839-1494938146@g.us", description: "Comissão Tributário", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554599713495-1480517299@g.us", description: "Colinas Golf", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554521019574-1606329207@g.us", description: "UL SEV Cascavel (lotericas)", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554588221318-1516105561@g.us", description: "Clube de Tiro Delta", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "120363195739111501@g.us", description: "Clube de Tiro Delta (Agregado)", blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554599254060-1591287848@g.us", description: null, blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "554599199917-1391270367@g.us", description: null, blockType: "soft", isBlocked: true, updatedAt: new Date() },
      { groupId: "120363029881649208@g.us", description: null, blockType: "soft", isBlocked: true, updatedAt: new Date() }
    ];
    
    // Insert groups with upsert
    let insertedCount = 0;
    let updatedCount = 0;
    
    for (const group of groupsToInsert) {
      // Check if the group already exists
      const existingGroup = await GroupSettings.findOne({ groupId: group.groupId });
      
      if (existingGroup) {
        // Update existing group
        await GroupSettings.updateOne(
          { groupId: group.groupId },
          { 
            $set: {
              description: group.description,
              blockType: "soft", 
              isBlocked: true,
              updatedAt: new Date()
            }
          }
        );
        updatedCount++;
        console.log(`Updated group: ${group.groupId} - ${group.description || 'No description'}`);
      } else {
        // Insert new group
        await GroupSettings.create(group);
        insertedCount++;
        console.log(`Inserted new group: ${group.groupId} - ${group.description || 'No description'}`);
      }
    }
    
    console.log(`\nOperation completed: ${insertedCount} groups inserted, ${updatedCount} groups updated`);
    
    // List all soft-blocked groups
    const blockedGroups = await GroupSettings.find({ isBlocked: true, blockType: "soft" });
    console.log(`\nTotal soft-blocked groups: ${blockedGroups.length}`);
    
    console.log("\nList of soft-blocked groups:");
    blockedGroups.forEach(group => {
      console.log(`- ${group.groupId} (${group.description || 'No description'})`);
    });
    
  } catch (error) {
    console.error('Error inserting soft-blocked groups:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the function
insertSoftBlockedGroups();