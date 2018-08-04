var express     = require("express");
var router      = express.Router();
var middleware  = require("../middleware");
var User        = require("../models/user");
var Post        = require("../models/post");
var Comment     = require("../models/comment");
var moment      = require("moment");

//======================================================
//MAIN HOME PAGE ROUTES
//======================================================
router.get("/home", middleware.isLoggedIn, function(req, res){
    //Populate user details
    User
        .findById(req.user._id)
        .populate({
            path: 'friendPosts',
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
    .exec(function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
        } else {
            res.render("main/home", {user: currentUser, page:"main/home", moment: moment}); 
        }
    });
});

//======================================================
//MAIN MESSAGES PAGE ROUTES
//======================================================
router.get("/messages", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("main/messages", {page:"main/messages"});
        }
    });
}); 

//======================================================
//MAIN NOTIFICATIONS PAGE ROUTES
//======================================================
router.get("/notifications", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("main/notifications", {user: currentUser, page:"main/notifications"}); 
        }
    });
}); 

//======================================================
//MAIN HOME PAGE POST ROUTES
//======================================================
router.post("/home", middleware.isLoggedIn, function(req, res){
    //Find user
    User.findById(req.user._id, function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
        } else {
            //Create post 
            Post.create(req.body.post, function(err, post){
                if(err || req.body.post.text == ""){
                    console.log(err);
                } else {
                    post.author = req.user._id;
                    post.save(function(err, savedPost){
                        if(err){
                            console.log(err);
                        } else {
                            //Save post to user details
                            currentUser.posts.unshift(savedPost._id);
                            currentUser.friendPosts.unshift(savedPost._id);
                            currentUser.friends.forEach(function(friendId){
                                User.findById(friendId, function(err, friendUser){
                                    if (err){
                                        console.log(err);
                                    } else {
                                        friendUser.friendPosts.unshift(savedPost._id);
                                        friendUser.save(function(err){
                                            if (err){
                                                console.log(err);
                                            }
                                        });
                                    }
                                });
                            });
                            currentUser.save(function(err){
                                if(err){
                                    console.log(err);
                                } else {
                                    res.redirect("/main/home/ajaxpost");
                                }
                            });
                        }
                    });
                }
            });    
        }
    });
});

router.get("/home/ajaxpost", middleware.isLoggedIn, function(req, res) {
    //Get user and populate details
    User
        .findById(req.user._id)
        .populate({
            path: 'friendPosts',
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
    .exec(function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
        } else {
            //Render main home page and send back to user 
            res.render("ajaxSnippets/mainHome", {user: currentUser, moment: moment}, function(err, html){
                if (err){
                    console.log(err);
                } else {
                    res.send({html: html, userPostsLength: currentUser.posts.length});
                }
            }); 
        }
    });
});

//======================================================
//MAIN HOME PAGE COMMENT ROUTES
//======================================================
router.post("/home/comment/:id", middleware.isLoggedIn, function(req, res){
    //Find post 
    Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            console.log(err);
        } else {
            //Create comment
            Comment.create(req.body.comment, function(err, comment){
                if(err || req.body.comment.text == ""){
                    console.log(err);
                } else {
                    comment.author = req.user._id;
                    comment.save(function(err, savedComment){
                        if(err){
                            console.log(err);
                        } else {
                            //Save comment to post details
                            foundPost.comments.unshift(savedComment._id);
                            foundPost.save(function(err){
                                if(err){
                                    console.log(err);
                                } else {
                                    res.redirect("/main/home/ajaxcomment/" + foundPost._id);
                                }
                            });
                        }
                    });
                }
            });    
        }
    });
});

router.get("/home/ajaxcomment/:id", middleware.isLoggedIn, function(req, res) {
    //Find post and populate details
    Post
        .findById(req.params.id)
        .populate({
            path: 'comments',
            populate: [{
                path: 'author'
            }]
        })
    .exec(function(err, foundPost){
        if(err || !foundPost){
            console.log(err);
        } else {
            //Render comments and send back to user
            res.render("ajaxSnippets/mainHomeComment", {posts: foundPost}, function(err, html){
                if (err){
                    console.log(err);
                } else {
                    res.send({html: html, postCommentsLength: foundPost.comments.length});
                }
            }); 
        }
    });
});

//======================================================
//MAIN HOME PAGE LIKE ROUTES
//======================================================
router.post("/home/like/:id", middleware.isLoggedIn, function(req, res){
    //Find post 
    Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            console.log(err);
        } else {
            //Check if user's id already in likes array
            var isInArray = foundPost.likes.some(function (like) {
                return like.equals(req.user._id);
            });
            //If user's id exists in array
            if (isInArray === true){
                //Remove user's id from array
                foundPost.likes.remove(req.user._id);
                foundPost.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        //Send back the number of user's id in likes array
                        //res.send doesn't accept integer so convert to string
                        res.send(String(foundPost.likes.length));
                    }
                });
            } else {
                //If user's id not in array
                foundPost.likes.unshift(req.user._id);
                foundPost.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        //Send back the number of user's id in likes array
                        //res.send doesn't accept integer so convert to string
                        res.send(String(foundPost.likes.length));
                    }
                });
            }
        }
    });
});

//======================================================
//MAIN HOME PAGE SEARCH ROUTES
//======================================================
router.get("/search", middleware.isLoggedIn, function(req, res){
    var query = req.body.query;
    //Search database by regular expression
    User.find({
        firstName: {$regex: new RegExp(query, "i")},
        // lastName: {$regex: new RegExp(query)}
    }, function(err, data){
        if(err){
            console.log(err);
        } else {
            var userArray = [];
            //Extract first and last name
            data.forEach(function(user){
                userArray.push({firstName: user.firstName, lastName: user.lastName, id: user._id});
            });
            //Send back data as array
            res.send(userArray);
        }
    }).limit(10);
});

module.exports = router;