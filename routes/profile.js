var express     = require("express");
var router      = express.Router();
var middleware  = require("../middleware");
var User        = require("../models/user");
var moment      = require("moment");

//======================================================
//USER PROFILE ROUTES
//======================================================
router.get("/:id", middleware.isLoggedIn, function(req, res){
    //Find user and populate details
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
            //Render profile page and send back to user
            res.render("userProfile/profile", {user: user, moment: moment}); 
        }
    });
}); 

//======================================================
//FRIENDS LIST ROUTES
//======================================================
router.get("/:id/friendslist", middleware.isLoggedIn, function(req, res){
    //Find user and populate friends
    User.findById(req.params.id).populate("friends")
    .exec(function(err, user){
        if(err || !user){
            console.log(err);
        } else {
            //Render friends list page and send back to user
            res.render("userProfile/friendsList", {user: user}); 
        }
    });
}); 

module.exports = router;