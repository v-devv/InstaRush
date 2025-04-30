
import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        mongoose.connection.on("connected" , ()=>{
            console.log("MongoDB connected successfully")
        })
        await mongoose.connect(`${process.env.MONGODB_URL}/instant` )
    } catch (error) {
        console.log("MongoDB connection error", error.message)
        console.log(process.env.MONGODB_URL)
    }
}
  
export default connectDB; 
