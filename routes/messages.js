var express     = require("express");
var router      = express.Router();
var middleware  = require("../middleware");
var User        = require("../models/user");

//======================================================
//MAIN MESSAGES PAGE ROUTES
//======================================================
router.get("/", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        if(err || !currentUser){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("main/messages", {page:"messages"});
        }
    });
}); 

module.exports = router;