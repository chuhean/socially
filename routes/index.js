var express = require("express");
var router = express.Router();

//======================================================
//GET ROUTES
//======================================================
router.get("/", function(req, res){
    res.render("landing"); 
});

//=========================================================
//AUTH ROUTES
//=========================================================


module.exports = router;