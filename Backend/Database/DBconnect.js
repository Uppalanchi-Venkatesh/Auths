var mongoose = require('mongoose');
require('dotenv').config();

module.exports.connect = function(connection_string, auto_reconnect){
    console.log("Trying to connect to MongoDB");
    var dbOptions = {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, auto_reconnect: true};
    var connection_string= process.env.Connection_String;
    if(auto_reconnect!==null && auto_reconnect!==undefined)
        dbOptions.auto_reconnect = auto_reconnect;

    console.log("DB AUTO RECONNECT: "+dbOptions.auto_reconnect);
    mongoose.connect(connection_string, dbOptions);

    var db = mongoose.connection;

    db.on('connecting', function () {
        console.log('connecting to MongoDB...');
    });

    db.on('error', function (error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', function () {
        console.log('MongoDB connected!');
    });
    db.once('open', function () {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
    db.on('disconnected', function () {
        if(dbOptions.auto_reconnect){
            console.log('MongoDB disconnected!');
        mongoose.connect(connection_string, dbOptions);
        }
    });
}

module.exports.disconnect = function(){
    mongoose.disconnect();
}