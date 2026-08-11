const mongoose = require('mongoose');

if (process.platform === 'win32') {
  try {
    require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
  } catch (err) {
    // Ignore DNS setServers error on local machine
  }
}

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
