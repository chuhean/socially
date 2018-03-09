var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    date: {type: Date, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Comment", commentSchema);