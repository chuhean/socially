var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var middleware  = require("../middleware");
var User        = require("../models/user");

//======================================================
//LANDING, LOGIN, SIGN UP ROUTES
//======================================================
//show landing page
router.get("/", middleware.isNotLoggedIn, function(req, res){
    res.render("landing"); 
});

//show login form
router.get("/login", middleware.isNotLoggedIn, function(req, res){
    res.render("login");
});

//show register form
router.get("/signup", middleware.isNotLoggedIn, function(req, res){
    res.render("signup");
});

//=========================================================
//AUTH ROUTES FOR LOGIN
//=========================================================
//handle sign up logic
router.post("/signup", middleware.isNotLoggedIn, function(req, res){
    //*need validate no empty fields*
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday, 
        gender: req.body.gender,
    });
    //*check if password matches confirm password*
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }   
        passport.authenticate("local")(req, res, function(){
            res.redirect("/main/home");
        });
    });
});

//handling login logic
router.post("/login", middleware.isNotLoggedIn, passport.authenticate("local", 
    {
        successRedirect: "/main/home",
        failureRedirect: "/login"
        
    }), function(req, res){
});

//=========================================================
//AUTH ROUTES FOR LOGOUT
//=========================================================

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;