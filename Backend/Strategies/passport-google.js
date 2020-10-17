var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var userLib = require('../Lib/userLib');
var model = require('../Model/userModel');
var config  = require('../Config/config');

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

var customFields = {
    clientID: config.client_id,
    clientSecret: config.client_secret,
    callbackURL: config.callback_url
}

var verifyCallback = (accessToken, refreshToken, profile, done) =>{
    //console.log("Profile : "+ profile.displayName);
    //console.log("Profile : "+JSON.stringify(profile));
    //console.log("Email : "+ JSON.stringify(profile.emails[0].value));
    var query = {email : profile.emails[0].value};
    userLib.getSingleItemByQuery(query, model, (err, user)=>{
        if(err)
            done(err);
        if(!user)
            return done(null, false, {message : 'Email is incorrect'});
        //console.log("User logged in succeessfully");
        return done(null, user, {message : 'Successfully logged in'});
    });
}

var strategy = new GoogleStrategy(customFields, verifyCallback);

passport.use(strategy);

module.exports = {passport};