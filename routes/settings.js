var express     = require("express");
var router      = express.Router();
var User        = require("../models/user")
var middleware  = require("../middleware");

//======================================================
//SETTINGS ROUTES
//======================================================
router.get("/", middleware.isLoggedIn, function(req, res){
    //Find user
    User.findById(req.user._id, function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
            res.redirect("back");
        } else {
            //Render settings page and send back to user
            res.render("settings/settings", {user: currentUser}); 
        }
    });
}); 

//======================================================
//UPDATE SETTINGS ROUTES
//======================================================
router.put("/", middleware.isLoggedIn, function(req, res){
    //Check if password matches with confirm password
    if (req.body.password===null){
        var newData = {aboutMe: req.body.aboutMe, email: req.body.email};
    } else {
        var newData = {aboutMe: req.body.aboutMe, email: req.body.email, password: req.body.password};
    }
    //Build new data 
    var newData = {aboutMe: req.body.aboutMe, email: req.body.email};
    //Find user and update new data
    User.findByIdAndUpdate(req.user._id, {$set: newData}, function(err, currentUser){
        if(err || !currentUser){
            res.redirect("back");
        } else {
            res.redirect("/settings");
        }
    });
});

module.exports = router;