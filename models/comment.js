var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: {type: String, required: true},
    date: Date,
    author: {
        //User ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Comment", commentSchema);