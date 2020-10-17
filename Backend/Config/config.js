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
    if(process.env.PRODUCTION)
        return 'https://logins-system.herokuapp.com/google/callback';
    else
        return '/google/callback';
}

module.exports = {
    connection_string : module.exports.getConnectionString(),
    port : process.env.PORT || 3000,
    salt_rounds : 10,
    session_secret : 'Thisisloginsystemproject',
    client_id : "210133538573-e2n0b18mi4flkrd94eumvsbk49o5nc8s.apps.googleusercontent.com",
    client_secret : '2AcLW_1nKVWwCJN8LJwBVvln',
    callback_url : module.exports.getCallbackURL()
}