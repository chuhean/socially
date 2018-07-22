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
            res.render("userProfile/profile", {user: user, currentUserID: req.user._id, moment: moment}); 
        }
    });
}); 

//======================================================
//ADD FRIEND ROUTES
//======================================================
router.post("/:id", middleware.isLoggedIn, function(req, res){
    //Find user and populate details
    User.findById(req.user._id, function(err, foundUser){
        if(err || !foundUser){
            console.log(err);
        } else {
            //Check if the friend's id already in user's friends array
            var isInArray = foundUser.friends.some(function (friend) {
                return friend.equals(req.params.id);
            });
            
            //If friend's id does not exist in array
            if (isInArray === false){
                //Add friend's id to user's friends array 
                foundUser.friends.unshift(req.params.id);
                foundUser.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        //Send back the number of user's id in likes array
                        //res.send doesn't accept integer so convert to string
                        res.send(String(foundPost.likes.length));
                    }
                });
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