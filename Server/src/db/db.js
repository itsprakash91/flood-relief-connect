import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        // Build connection string - handle cases where DB_NAME might already be in URI
        let connectionURI = process.env.MONGODB_URI;
        
        // If connection string doesn't already include database name, add it
        if (!connectionURI.includes(DB_NAME) && !connectionURI.includes('?')) {
            connectionURI = `${connectionURI}/${DB_NAME}`;
        } else if (!connectionURI.includes(DB_NAME) && connectionURI.includes('?')) {
            // If there's already a query string, insert DB name before it
            connectionURI = connectionURI.replace('?', `/${DB_NAME}?`);
        }
        
        const connectionInstance = await mongoose.connect(connectionURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        console.log(`\n✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        console.log(`✅ Database: ${connectionInstance.connection.name}`);
        
    } catch (error) {
        console.log("\n❌ MONGODB connection error:", error.message);
        if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log("\n⚠️  IMPORTANT: Your IP address is not whitelisted in MongoDB Atlas!");
            console.log("   1. Go to: https://cloud.mongodb.com");
            console.log("   2. Navigate to: Network Access > Add IP Address");
            console.log("   3. Click 'Add Current IP Address' or add '0.0.0.0/0' (for development only)");
        }
        process.exit(1)
    }
}

export default connectDB


// url : mongodb+srv://floodAdmin:flood912863@cluster0.5huypzl.mongodb.net/?appName=Cluster0