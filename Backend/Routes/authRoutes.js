var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleURL,FacebookURL;
require('../Strategies/passport-local').passport;
require('../Strategies/passport-google').passport;
require('../Strategies/passport-facebook').passport;
require('dotenv').config(); 

if(process.env.PRODUCTION) {
    console.log("Production");
    GoogleURL = process.env.GOOGLE_CALLBACK_URL1;
    FacebookURL = process.env.FB_CALLBACK_URL1;
} else {
    console.log("Development");
    GoogleURL = process.env.GOOGLE_CALLBACK_URL;
    FacebookURL = process.env.FB_CALLBACK_URL;
}

router.post('/auth/login', 
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
}));

router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile','email'] })
);

router.get(GoogleURL, 
    passport.authenticate('google', {
        successRedirect : '/dashboard',
        failureRedirect: '/login', 
        failureFlash: true
}));

router.get('/auth/facebook',
    passport.authenticate('facebook',{ scope: ['email'] })
);

router.get(FacebookURL,
    passport.authenticate('facebook', { 
        successRedirect : '/dashboard',
        failureRedirect: '/login',
        failureFlash : true 
}));

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

module.exports = router;