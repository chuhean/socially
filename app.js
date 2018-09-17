//======================================================
//IMPORT MODULES
//======================================================
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    session         = require("express-session")({
                        secret:"This is the website of the social media platform Socially.",
                        resave: false,
                        saveUninitialized: false
                      }),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    helmet          = require("helmet"),
    compression     = require('compression');

//======================================================
//IMPORT MONGOOSE MODEL
//======================================================
var User            = require("./models/user");

//======================================================
//IMPORT ROUTES
//======================================================
var indexRoutes     = require("./routes/index");
var mainRoutes      = require("./routes/main");
var profileRoutes   = require("./routes/profile");
var settingsRoutes  = require("./routes/settings");
var messagesRoutes  = require("./routes/messages");

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
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email',
    }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//======================================================
//MOUNT TO NODEJS SERVER AND CONNECT TO SOCKET.IO
//======================================================
var server = require('http').Server(app);
var io = require('socket.io')(server);

//======================================================
//CREATE 'MESSAGES' NAMESPACE IN SOCKET.IO
//======================================================
var middleware  = require("./middleware"),
    sharedsession = require("express-socket.io-session"),
    msg = io.of('/messages').use(sharedsession(session, {
        autoSave: true
    })),
    onlineUsers = [];

msg.use((socket, next) => {
    console.log('middleware')
    if (middleware.isLoggedIn) return next();
    next(new Error('Authentication error'));
});

msg.on('connection', function (socket) {
    //Get user id from email, and match it with the assigned socket.id.
    User.find({ email: socket.handshake.session.passport.user }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            onlineUsers.push({userID: user._id, userSocketID: socket.id});
        }
    });
    console.log('middleware')
    socket.on('message', function(msg){
        // let token = socket.handshake.query.token;
        socket.broadcast.emit('message', msg);
    });
});

//======================================================
//UTILIZING ROUTES
//======================================================
app.use("/", indexRoutes);
app.use("/", mainRoutes);
app.use("/messages", messagesRoutes);
app.use("/profile", profileRoutes);
app.use("/settings", settingsRoutes);

//======================================================
//INITIATE NODEJS TO START LISTENING REQUEST
//======================================================
server.listen(process.env.PORT);


