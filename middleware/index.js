//Middleware for authentication
var middlewareObj = {};

//Check whether user has login at home page
middlewareObj.isLoggedInHome = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //Show landing page
    res.render("landing");
}

//Check whether user has login 
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Check whether user has not login 
middlewareObj.isNotLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/main/home");
}

module.exports = middlewareObj;