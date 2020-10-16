var mongoose = require('mongoose');

var registerUser=new mongoose.Schema({
        "username": {type:String, required:true},
        "email": {type:String, required:true},
        "password": {type:String, required:true},
    }
)
module.exports=mongoose.model("Auth",registerUser);