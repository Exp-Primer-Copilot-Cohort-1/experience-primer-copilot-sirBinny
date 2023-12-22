// Create Web Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

// Set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments');
var Comment = require('./models/comment');

// Set up CORS
var cors = require('cors');
app.use(cors());

// Set up cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set up sessions
var session = require('express-session');
var secret = 'cmpe273_secret_key';
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));

// Set up Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (username, password, done) {
    console.log('Inside passport.use() callback');
    User.findOne({ email: username }, function (err, user) {
        if (err) {
            console.log('Error occured: ' + err);
            return done(err);
        }
        if (!user) {
            console.log('User not found with username ' + username);
            return done(null, false);
        }
        if (user.password != password) {
            console.log('Invalid password');
            return done(null, false);
        }
        console.log('User authenticated');
        return done(null, user);
    });
}));

// Set up Passport session
passport.serializeUser(function (user, done) {
    console.log('Inside serializeUser callback. User id is save to the session file store here');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('Inside deserializeUser callback');
    console.log('The user id passport saved in the session file store is: ' + user._id);
    User.findById(user._id, function (err, user) {
        done(err, user);
    });
});

// Create a new comment
router.route('/comments').post(function (req, res) {
    console.log('Inside POST /comments callback function');
    console.log(req.body);
    var comment = new Comment(req.body);
