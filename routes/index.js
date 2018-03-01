var express = require("express");
var router = express.Router();

//======================================================
//GET ROUTES
//======================================================
//show landing page
router.get("/", function(req, res){
    res.render("landing"); 
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//=========================================================
//AUTH ROUTES
//=========================================================


module.exports = router;