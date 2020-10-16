var express = require('express');
var app = express();
var path = require('path');
var userLib = require('./Backend/Lib/userLib');
var db = require('./Backend/Database/DBconnect');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var passport = require('passport');
require('./Backend/Strategies/passport-local');
require('./Backend/Strategies/passport-google');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('express-flash');
//var cookieParser = require('cookie-parser');
//app.use(cookieParser());
require('dotenv').config();

db.connect('mongodb+srv://venkat_chintu:Uppalanchi@14@cluster0.a4lxc.mongodb.net/<dbname>?retryWrites=true&w=majority', true);

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'Frontend', 'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(bodyParser.json());
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 
    },
    //cookie: { secure: false },
    store : new MongoStore({mongooseConnection : mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'Frontend')));

app.get('/', (req,res) =>{
    res.render('home', {title : 'Homepage'});
});

app.get('/login',checkNotAuthenticated, (req,res) =>{
    res.render('login', {title : 'Login'});
});

app.get('/register',checkNotAuthenticated, (req,res) =>{
    res.render('register', {title : 'Register'});
});

app.post('/register', async (req,res) =>{
    try{
        req.body.password = await bcrypt.hash(req.body.password, 10);
        userLib.createUser(req.body);
        res.redirect('/login');
    }catch(err){
        console.log("Error : "+err);
        res.redirect('/register');
    }
});

app.get('/dashboard',checkAuthenticated, (req,res) =>{
    res.send(`<h1>Welcome ${req.user.username}</h1> <a href='/logout'> Logout</a>`);
});

app.post('/login', 
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
}));

app.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

app.get('/google/callback', 
    passport.authenticate('google',{
        successRedirect : '/dashboard',
        failureRedirect: '/login', 
        failureFlash: true
}));

app.get('/logout', (req,res) =>{
    req.logOut();
    res.redirect('/login');
});

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated())
        return res.redirect('/dashboard');
    next();
}

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

var port = process.env.PORT || 3000;

app.listen(port, (req,res) =>{
    console.log(`Site Running on http://localhost:${port}`);
});