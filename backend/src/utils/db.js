import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO_DB Connected : ${connection.connection.host}`)
    } catch (error) {
        console.log('MONGO_DB Connection Failed',error)
    }
}