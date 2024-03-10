import mongoose from "mongoose";

const connectDb = async ()=>{

    try {
        const connect = await mongoose.connect(process.env.MONGO_DB);
        console.log(`Database connected on ${connect.connection.host}`)

        
    } catch (error) {
        console.log(`Error ${error}`)    
    }
}

export default connectDb