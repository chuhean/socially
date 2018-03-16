var mongoose    = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema  = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    aboutMe: String,
    email: {type: String, required: true, unique: true},
    birthday: {type: String, required: true}, 
    gender: {type: String, required: true}, 
    password: String,
    friends: [
        //User ID
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        //Post ID
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    friendPosts: [
        //Post ID
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("User", UserSchema);