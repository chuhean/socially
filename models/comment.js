var mongoose = require("mongoose");

//Comment Schema
var commentSchema = mongoose.Schema({
    text: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now},
    author: {
        //User ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Comment", commentSchema);