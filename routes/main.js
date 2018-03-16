var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");
var Post = require("../models/post");
var Comment = require("../models/comment");

router.get("/home", middleware.isLoggedIn, function(req, res){
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
        if(err){
            console.log(err);
        } else {
            res.render("main/home", {user: currentUser, page:"main/home"}); 
        }
    });
});

router.get("/messages", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("main/messages", {page:"main/messages"});
        }
    });
}); 

router.get("/notifications", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("main/notifications", {user: currentUser, page:"main/notifications"}); 
        }
    });
}); 

router.post("/home", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        if(err){
            console.log(err);
        } else {
            Post.create(req.body.post, function(err, post){
                if(err || req.body.post.text == ""){
                    console.log(err);
                } else {
                    post.author = req.user._id;
                    post.save(function(err, savedPost){
                        if(err){
                            console.log(err);
                        } else {
                            currentUser.posts.unshift(savedPost._id);
                            currentUser.friendPosts.unshift(savedPost._id);
                            currentUser.save();
                            res.redirect("/main/home/ajaxpost");
                        }
                    });
                }
            });    
        }
    });
});

router.get("/home/ajaxpost", middleware.isLoggedIn, function(req, res) {
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
        if(err){
            console.log(err);
        } else {
            res.render("ajaxSnippets/mainHome", {user: currentUser}); 
        }
    });
});

router.post("/home/comment/:id", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err || req.body.comment.text == ""){
                    console.log(err);
                } else {
                    comment.author = req.user._id;
                    comment.save(function(err, savedComment){
                        if(err){
                            console.log(err);
                        } else {
                            foundPost.comments.unshift(savedComment._id);
                            foundPost.save();
                            res.redirect("/main/home/ajaxcomment/" + foundPost._id);
                        }
                    });
                }
            });    
        }
    });
});

router.get("/home/ajaxcomment/:id", middleware.isLoggedIn, function(req, res) {
    Post
        .findById(req.params.id)
        .populate({
            path: 'comments',
            populate: [{
                path: 'author'
            }]
        })
    .exec(function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render("ajaxSnippets/mainHomeComment", {friendPosts: post}); 
        }
    });
});

module.exports = router;