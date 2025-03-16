// src/scripts/importAlbums.js
require('dotenv').config({ path: '../.env' }); // Try to locate the .env file in the parent directory
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Album = require('../models/Album');

async function importAlbums() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');

    // Read the CSV file
    const filePath = path.join(__dirname, '../../data/albums.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV
    const lines = fileContent.split('\n').filter(line => line.trim());
    const header = lines[0].split('|');
    
    const albums = [];
    
    // Start from index 1 to skip the header
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('|');
      if (values.length >= 3) {
        albums.push({
          year: values[0].trim(),
          album: values[1].trim(),
          artist: values[2].trim(),
          selected: false,
          selectedAt: null
        });
      }
    }
    
    console.log(`Parsed ${albums.length} albums from CSV file`);
    
    // Clear existing data (optional)
    const deleteResult = await Album.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing albums`);
    
    // Insert new data
    const insertResult = await Album.insertMany(albums);
    console.log(`Imported ${insertResult.length} albums to database`);
    
  } catch (error) {
    console.error('Error importing albums:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

importAlbums();