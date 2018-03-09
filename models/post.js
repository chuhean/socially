var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    text: String,
    date: {type: Date, required: true},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);