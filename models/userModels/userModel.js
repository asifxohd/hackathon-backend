import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type:String,
        require:true,
        default:false
    }
},{timestamps:true});

export default mongoose.model('users',userSchema);