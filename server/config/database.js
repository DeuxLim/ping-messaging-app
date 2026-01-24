// server/db.js
import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ MongoDB database connected...");

		if (
			process.env.NODE_ENV === "development" &&
			process.env.MONGO_URI === "messenger-clone"
		) {
			console.warn("⚠️  Using PROD database in development!");
		}
	} catch (error) {
		console.error("❌ MongoDB database connection failed:", error.message);
		process.exit(1); // stop the app if DB fails
	}
};

export default connectDB;
