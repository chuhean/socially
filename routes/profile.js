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
            //Check if the friend's id already in user's friends array
            var isInArray = user.friends.some(function(friend){
                return friend.equals(req.params.id);
            });
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
    User.findById(req.user._id).populate("friendPosts").exec(function(err, foundUser){
        if(err || !foundUser){
            console.log(err);
        } else {
            //Check if the friend's id already in user's friends array
            var isInArray = foundUser.friends.some(function(friend){
                return friend.equals(req.params.id);
            });
            
            //If friend's id does not exist in array
            if (isInArray === false){
                //Add friend's id to user's friends array 
                foundUser.friends.unshift(req.params.id);

                User.findById(req.params.id).populate("friendPosts").exec(function(err, foundFriend){
                    if (err){
                        console.log(err);
                    } else {
                    //Add user's id to friend's 'friends' array
                    foundFriend.friends.unshift(req.user._id);
                    
                    //Add all of friend's posts to user's 'friendPosts' array
                    foundUser.friendPosts = foundFriend.posts.concat(foundUser.friendPosts);
                    //Sort user's 'friendPosts' by date
                    foundUser.friendPosts.sort(function(a, b){return b.date - a.date});
                    
                    //Add all of user's posts to friend's 'friendPosts' array
                    foundFriend.friendPosts = foundUser.posts.concat(foundFriend.friendPosts);
                    //Sort Friend's 'friendPosts' by date
                    foundFriend.friendPosts.sort(function(a, b){return b.date - a.date});
                    
                    //Save user to database 
                    foundUser.save(function(err){
                        if(err){
                            console.log(err);
                        } else {
                            foundFriend.save(function(err){
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                    }        
                });
                
                //Send back response to user
                //This is asynchonous with the above operations to prevent database query delay user response
                res.send({html: '<a href="#" class="btn btn-primary btn-sm"><i class="fas fa-check"></i> Friend</a>'});
            }
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