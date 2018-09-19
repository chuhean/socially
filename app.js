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
    onlineUsers = [];
    
io.use(sharedsession(session));

//Check user authentication before socket connection
io.use((socket, next) => {
    if (middleware.isLoggedIn) return next();
    next(new Error('Authentication error'));
});

io.on('connection', function (socket) {
    //Get user id from email, and match it with the assigned socket.id.
    User.find({ email: socket.handshake.session.passport.user }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            onlineUsers.push({userID: String(user[0]._id), userSocketID: socket.id});
        }
    });
    socket.on('message', function(msg){
        let friendId = String(socket.handshake.query.id);
        let friendObject = onlineUsers.filter(obj => {
            return obj.userID === friendId;
        });
        var friendSocketId = friendObject[0].userSocketID;
        io.to(friendSocketId).emit('message', msg);
    });
    
    socket.on('disconnect', function(){
        onlineUsers = onlineUsers.filter(function(el) { return el.userSocketID != socket.id; }); 
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


