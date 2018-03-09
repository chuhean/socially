var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");

router.get("/", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id).populate("friendPosts").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("userProfile/profile", {user: foundUser}); 
        }
    });
});  

router.get("/friendslist", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id).populate("friendPosts").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("userProfile/friendsList", {user: foundUser}); 
        }
    });
});  

module.exports = router;