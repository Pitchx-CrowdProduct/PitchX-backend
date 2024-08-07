const mongoose = require('mongoose');
const dotenv =require('dotenv');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongooseConn;

if (!cached) {
    cached = global.mongooseConn = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, 
        socketTimeoutMS: 45000, 
    };
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI,opts).then((mongoose) => {
            console.log("Successfully connected to MongoDB."); 
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = dbConnect;