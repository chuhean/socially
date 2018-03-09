var express     = require("express");
var router      = express.Router();
var User        = require("../models/user")
var middleware  = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("settings/settings"); 
}); 

router.put("/", middleware.isLoggedIn, function(req, res){
    if (req.body.password===null){
        var newData = {aboutMe: req.body.aboutMe, email: req.body.email};
    } else {
        var newData = {aboutMe: req.body.aboutMe, email: req.body.email, password: req.body.password};
    }
    var newData = {aboutMe: req.body.aboutMe, email: req.body.email};
    User.findByIdAndUpdate(req.user._id, {$set: newData}, function(err, user){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/settings");
        }
    });
});

module.exports = router;