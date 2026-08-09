const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Something serious failed
    process.exit(1);
  }
}

module.exports = connectDB;
