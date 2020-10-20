var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var userLib = require('../Lib/userLib');
var model = require('../Model/userModel');
require('dotenv').config();

passport.serializeUser((user, done)=> {
    done(null, user._id);
});

passport.deserializeUser((id , done)=>{
    var query = {_id : id};
    userLib.getItemById(query, model, (err, dbUser)=>{
        if(err)
            return done(err,dbUser);
        return done(null,dbUser);
    });
});

var URL;

if(process.env.NODE_ENV === 'production') 
    URL = process.env.GOOGLE_CALLBACK_URL1;
else 
    URL = process.env.GOOGLE_CALLBACK_URL;

var customFields = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : URL
}

var errors1=[];

var verifyCallback = (accessToken, refreshToken, profile, done) =>{
    //console.log("Profile : "+ profile.displayName);
    //console.log("Profile : "+JSON.stringify(profile));
    //console.log("Email : "+ JSON.stringify(profile.emails[0].value));
    var query = {email : profile.emails[0].value};
    userLib.getSingleItemByQuery(query, model, (err, user)=>{
        if(err){
            errors1[0]=err;
            return done(err);
        }
        if(!user){
            errors1[0]='No user with that email !';
            return done(null, false);
        }
        return done(null, user);
    });
}

var strategy = new GoogleStrategy(customFields, verifyCallback);

passport.use(strategy);

module.exports = {passport,errors1};