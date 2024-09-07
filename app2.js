const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Blog = require('./models/Blog');
const app = express()
const indexRoutes = require('./routes/index');

require('dotenv').config();

const PORT = process.env.PORT || 1337
const mongoString = process.env.MONGO_URL 

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));




/*
mongoose.connect('mongodb+srv://TT:TT@goldtrade.skpkklp.mongodb.net/');    
app.use(require('express-session')({
    secret:'Miss white is my cat',
    resave: false,
    saveUninitialized: false
}));
*/


mongoose.connect('mongodb+srv://TestTest:TestTest@goldtrade.skpkklp.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());


// Configure Passport.js to use the User model
// passport.use(User.createStrategy()); //new
passport.use(new LocalStrategy(User.authenticate())); //old
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', indexRoutes);

// Default blogs
const defaultBlogs = [
    { title: 'Welcome to Our Blog', content: 'This is the first default blog.' },
    { title: 'Introduction to Our Platform', content: 'This is the second default blog.' }
  ];
  
  // Insert default blogs into the database on startup
//   Blog.insertMany(defaultBlogs);
  //, (err) => {
  //    if (err) console.log('Error inserting default blogs:', err);
  //}

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
  