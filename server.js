var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var path = require('path');

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'Frontend', 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Frontend')));

app.get('/', (req,res) =>{
    res.render('home', {title : 'Homepage'});
});

app.get('/login', (req,res) =>{
    res.render('login', {title : 'Login'});
});

app.get('/register', (req,res) =>{
    res.render('register', {title : 'Register'});
});

var port = process.env.PORT || 3000;

app.listen(port, (req,res) =>{
    console.log(`Site Running on http://localhost:${port}`);
});