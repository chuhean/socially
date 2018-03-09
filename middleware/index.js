var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.isNotLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/main/home");
}

module.exports = middlewareObj;