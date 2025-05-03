import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected")
        });
        // console.log("🔍 ENV MONGODB_URL:",process.env.MONGODB_URL);
        await mongoose.connect(`${process.env.MONGODB_URL}`)
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}

export default connectDB;



