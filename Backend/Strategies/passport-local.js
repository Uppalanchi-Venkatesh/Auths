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

var authenticateUser = async (username, password, done) =>{
    var query = {username : username};
    await userLib.getSingleItemByQuery(query, model, async (err,user) =>{
        if(err)
            return done(err, {message : err});
        if(!user)
            return done(null, false, {message : 'Username is incorrect'});
        await bcrypt.compare(password, user.password, (err, result) =>{
            if(err)
                return done(err, {message : err});
            if(result)
                return done(null, user);
            return done(null, false, {message : 'Password is incorrect!!'});
        });
    });
}

var strategy = new localStrategy(Fields,authenticateUser);

passport.use(strategy);

module.exports = passport;
