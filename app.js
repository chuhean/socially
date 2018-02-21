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
    methodOverride  = require("method-override");

//======================================================
//IMPORT ROUTES
//======================================================
var indexRoutes     = require("./routes/index");

//======================================================
//CONNECT APPJS TO MONGODB DATABASE
//======================================================
mongoose.connect("mongodb://localhost/socially");

//======================================================
//UTILIZE IMPORTED FUNCTIONS
//======================================================
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//======================================================
//PASSPORTJS CONFIGURATION
//======================================================


//======================================================
//UTILIZING ROUTES
//======================================================
app.use("/", indexRoutes);

//======================================================
//INITIATE NODEJS TO START LISTENING REQUEST
//======================================================
app.listen(process.env.PORT, process.env.IP);

