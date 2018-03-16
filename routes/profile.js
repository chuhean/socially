var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");

router.get("/:id", middleware.isLoggedIn, function(req, res){
    User
        .findById(req.params.id)
        .populate({
            path: 'posts',
            populate: [{
              path: 'author',  
            },
            {
                path: 'likes',
            },
            {
                path: 'comments',
                populate: [{
                    path: 'author'
                }]
            }]
        })
    .exec(function(err, user){
        if(err || !user){
            console.log(err);
        } else {
            res.render("userProfile/profile", {user: user}); 
        }
    });
}); 

router.get("/:id/friendslist", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("friends")
    .exec(function(err, user){
        if(err || !user){
            console.log(err);
        } else {
            res.render("userProfile/friendsList", {user: user}); 
        }
    });
}); 

module.exports = router;