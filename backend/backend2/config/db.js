const mongoose = require('mongoose');

// Force reliable public DNS resolvers (Cloudflare + Google).
// Fixes "querySrv ECONNREFUSED" — a known Windows/Node.js issue where the
// SRV DNS lookup that mongodb+srv:// needs fails even though your internet works fine.
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
