import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || "";
    if (!uri) {
      throw new Error("MONGO_URI or MONGODB_URI or MONGO_URL not set in environment");
    }
    // if no DB name provided, append default DB name
    let finalUri = uri;
    if (!uri.includes("/") || uri.endsWith("/")) {
      finalUri = uri.replace(/\/+$/,"") + "/car_rental";
    }
    if (!finalUri.startsWith("mongodb://") && !finalUri.startsWith("mongodb+srv://")) {
      throw new Error('Invalid scheme for MongoDB URI. It must start with "mongodb://" or "mongodb+srv://"');
    }

    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(finalUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected to", finalUri);
  } catch (error) {
    console.error("❌ MongoDB connection error — full stack:");
    console.error(error && error.stack ? error.stack : error);
    throw error;
  }
};

export default connectDB;
