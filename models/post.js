var mongoose = require("mongoose");

//Post Schema
var postSchema = mongoose.Schema({
    text: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now},
    author: {
        //User ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [
        //User ID
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        //Comment ID
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);