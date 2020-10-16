var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var userLib = require('../Lib/userLib');
var model = require('../Model/userModel');
var bcrypt = require('bcrypt');

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

var Fields = {username : 'username', password : 'password'};

var authenticateUser = (username, password, done) =>{
    var query = {username : username};
    userLib.getSingleItemByQuery(query, model, (err,user) =>{
        if(err)
            return done(err);
        if(!user)
            return done(null,false);
        bcrypt.compare(password, user.password, (err, result) =>{
            if(err)
                return done(err);
            if(result)
                return done(null, user);
            return done(null, false);
        });
    });
}

var strategy = new localStrategy(Fields,authenticateUser);

passport.use(strategy);

module.exports = passport;
