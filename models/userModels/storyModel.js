

import mongoose from "mongoose"

const Schema = mongoose.Schema

const storySchema = Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
   name: {
        type:String,
        required: true
    },
    image : {
        type : String 
    }
},{
    timestamps : true
})

const Story = mongoose.model('story', storySchema )


export default Story