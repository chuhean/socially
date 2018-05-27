//======================================================
//IMPORT MODULES
//======================================================
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    helmet          = require("helmet"),
    compression     = require('compression');
    
//======================================================
//IMPORT MONGOOSE MODEL
//======================================================
var User            = require("./models/user"),
    Post            = require("./models/post"),
    Comment         = require("./models/comment"),
    Message         = require("./models/message");

//======================================================
//IMPORT ROUTES
//======================================================
var indexRoutes     = require("./routes/index");
var mainRoutes      = require("./routes/main");
var profileRoutes   = require("./routes/profile");
var settingsRoutes  = require("./routes/settings");

//======================================================
//CONNECT APPJS TO MONGODB DATABASE
//======================================================
mongoose.connect("mongodb://localhost/socially");

//======================================================
//UTILIZE IMPORTED FUNCTIONS
//======================================================
app.use(compression());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(helmet());

//======================================================
//PASSPORTJS CONFIGURATION
//======================================================
app.use(require("express-session")({
    secret:"This is the website of the social media platform Socially.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email',
    }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});

//======================================================
//UTILIZING ROUTES
//======================================================
app.use("/", indexRoutes);
app.use("/main", mainRoutes);
app.use("/profile", profileRoutes);
app.use("/settings", settingsRoutes);

//======================================================
//INITIATE NODEJS TO START LISTENING REQUEST
//======================================================
app.listen(process.env.PORT, process.env.IP);

