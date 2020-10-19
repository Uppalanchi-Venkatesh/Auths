var express = require('express');
var app = express();
var path = require('path');
var userLib = require('./Backend/Lib/userLib');
var model = require('./Backend/Model/userModel');
var db = require('./Backend/Database/DBconnect');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var errors1 = require('./Backend/Strategies/passport-google').errors1;
var errors2 = require('./Backend/Strategies/passport-local').errors2;
var errors3 = require('./Backend/Strategies/passport-facebook').errors3;
var str1="",str2="";
require('./Backend/Strategies/passport-local').passport;
require('./Backend/Strategies/passport-google').passport;
require('./Backend/Strategies/passport-facebook').passport;
require('dotenv').config(); 

db.connect(process.env.CONNECTION_STRING, true);

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'Frontend', 'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(session({
    secret : process.env.SESSION_SECRET,
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

app.get('/login', checkNotAuthenticated, (req,res) =>{
    str1="";
    if(errors1.length>0 && errors1[0]!=="") {
        str1=errors1[0];
        errors1[0]="";
    }
    if(errors2.length>0 && errors2[0]!=="") {
        str1=errors2[0];
        errors2[0]="";
    }
    if(errors3.length>0 && errors3[0]!=="") {
        str1=errors3[0];
        errors3[0]="";
    }
    res.render('login', {title : 'Login' , message : str1});
});

app.get('/register', checkNotAuthenticated, (req,res) =>{
    res.render('register', {title : 'Register', message : str2});
});

app.post('/register', (req,res) =>{
    str2="";
    try{
        var query = {email : req.body.email};
        userLib.getSingleItemByQuery(query, model, async function(err, dbUser){
            if(dbUser){
                str2='This email already taken !'
                return res.redirect('/register');
            }
            else{
                req.body.password = await bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS));
                userLib.createUser(req.body);
                return res.redirect('/login');
            }
        });
    }catch(err){
        console.log("Error : "+err);
        str2=err;
        res.redirect('/register');
    }
});

app.get('/dashboard', checkAuthenticated, (req,res) =>{
    res.render('dashboard', {title : 'Dashboard', user : req.user.username});
});

app.post('/login', 
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
}));

app.get('/google', checkNotAuthenticated,
    passport.authenticate('google', { scope: ['profile','email'] })
);

app.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect : '/dashboard',
        failureRedirect: '/login', 
        failureFlash: true
}));

app.get('https://logins-system.herokuapp.com/google/callback', 
    passport.authenticate('google', {
        successRedirect : '/dashboard',
        failureRedirect: '/login', 
        failureFlash: true
}));

app.get('/facebook',
    passport.authenticate('facebook',{ scope: ['email'] })
);

app.get('/facebook/callback',
    passport.authenticate('facebook', { 
        successRedirect : '/dashboard',
        failureRedirect: '/login',
        failureFlash : true 
}));

app.get('https://logins-system.herokuapp.com/facebook/callback', 
    passport.authenticate('facebook', {
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