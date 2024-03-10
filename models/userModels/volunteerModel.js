
import mongoose from "mongoose";

const Schema = mongoose.Schema

const volunteerSchema = Schema({

    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        unique: true
    }

},{
    timestamps:true
}) 


const Volunteer = mongoose.model('volunteer',volunteerSchema)

export default Volunteer