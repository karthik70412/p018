// server/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Uses the connection string from the .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;