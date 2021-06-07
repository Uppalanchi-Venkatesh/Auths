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
var authRoutes = require('./Backend/Routes/authRoutes');
var { errors1 } = require('./Backend/Strategies/passport-google');
var { errors2 } = require('./Backend/Strategies/passport-local');
var { errors3 } = require('./Backend/Strategies/passport-facebook');
var str1 = "", str2 = "", str3 = "";
require('dotenv').config();

db.connect(process.env.CONNECTION_STRING, true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Frontend', 'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    //cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'Frontend')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Homepage' });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    str1 = "";
    if (errors1.length > 0 && errors1[0] !== "") {
        str1 = errors1[0];
        errors1[0] = "";
    }
    if (errors2.length > 0 && errors2[0] !== "") {
        str1 = errors2[0];
        errors2[0] = "";
    }
    if (errors3.length > 0 && errors3[0] !== "") {
        str1 = errors3[0];
        errors3[0] = "";
    }
    res.render('login', { title: 'Login', message: str1 });
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    str3 = "";
    if (str2.length > 0) {
        str3 = str2;
        str2 = "";
    }
    res.render('register', { title: 'Register', message: str3 });
});

app.get('/google', (req,res) => {
    res.render('googleLogin', { title: 'Google Login' });
});

app.post('/register', (req, res) => {
    str2 = "";
    try {
        var query = { email: req.body.email };
        userLib.getSingleItemByQuery(query, model, async function (err, dbUser) {
            if (dbUser) {
                str2 = 'This email already taken !';
                return res.redirect('/register');
            } else {
                str2 = "";
                req.body.password = await bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS));
                userLib.createUser(req.body);
                return res.redirect('/login');
            }
        });
    } catch (err) {
        console.log("Error : " + err);
        str2 = err;
        res.redirect('/register');
    }
});

app.use(authRoutes);

app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.user.username });
});

app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        if (err)
            return next(err);
        req.session = null;
        res.redirect('/login');
    });
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return res.redirect('/dashboard');
    next();
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

var port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    console.log(`Site Running on http://localhost:${port}`);
});