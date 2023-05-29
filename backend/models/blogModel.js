const mongoose= require("mongoose")


const blogSchema= mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    title: {
        type: String,
        require: [true, "title is required"],
        trim: true,
    },
    description:{
        type: String,
        require: [true, "description is required"],
        trim: true,
    },
    slug:{
        type: String,
        unique: true,
    }, 
    image:{
        type: Object,
        default: {}
    }
    
}, {
    timestamps: true
})


const Blog= mongoose.model("Blog", blogSchema);
module.exports= Blog