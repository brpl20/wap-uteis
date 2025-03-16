// src/services/albumService.js
const Album = require('../models/Album');

async function getRandomAlbum() {
    try {
      // Find out how many unselected albums exist
      const unselectedCount = await Album.countDocuments();
      
      if (unselectedCount === 0) {
        // Handle the case when no albums are left
        console.log("No albums remaining in the database.");
        return null;
      }
      
      // Randomly select an album
      const randomSkip = Math.floor(Math.random() * unselectedCount);
      const album = await Album.findOne().skip(randomSkip);
      
      if (!album) {
        throw new Error("Could not find an album");
      }
      
      // Delete the album from the database
      await Album.findByIdAndDelete(album._id);
      console.log(`Album "${album.album}" by ${album.artist} has been selected and removed from the database.`);
      
      return album;
    } catch (error) {
      console.error("Error selecting random album:", error);
      throw error;
    }
  }
  
  // We don't need the markAlbumAsSelected function anymore since we're deleting them
  // But we can add a function to get album count
  async function getAlbumCount() {
    return await Album.countDocuments();
  }
  
  module.exports = {
    getRandomAlbum,
    getAlbumCount
  };  