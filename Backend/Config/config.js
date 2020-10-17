module.exports.getConnectionString =function(){
    if(process.env.PRODUCTION){
        console.log("RUNNING PRODUCTION MODE");
        return process.env.MONGODB_CONNECTION_STRING || "mongodb+srv://venkat_chintu:Uppalanchi@14@cluster0.a4lxc.mongodb.net/<dbname>?retryWrites=true&w=majority";
    }
    else{
        console.log("RUNNING DEVELOPMENT MODE");
        return "mongodb+srv://venkat_chintu:Uppalanchi@14@cluster0.a4lxc.mongodb.net/<dbname>?retryWrites=true&w=majority";
    }
}

module.exports.getCallbackURL =function(){
    if(process.env.PRODUCTION){
        return 'https://logins-system.herokuapp.com/google/callback';
    }
    else{
        return '/google/callback';
    }
}

module.exports = {
    CONNECTION_STRING : module.exports.getConnectionString(),
    PORT : process.env.PORT || 3000,
    SALT_ROUNDS : 10,
    SESSION_SECRET : "This is login system project",
    CLIENT_ID : "210133538573-e2n0b18mi4flkrd94eumvsbk49o5nc8s.apps.googleusercontent.com",
    CLIENT_SECRET : '2AcLW_1nKVWwCJN8LJwBVvln',
    CALLBACK_URL : module.exports.getCallbackURL()
}