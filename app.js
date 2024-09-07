const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const Blog = require('./models/Blog');
const app = express();
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb+srv://TestTest:TestTest@goldtrade.skpkklp.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

// Default blogs
const defaultBlogs = [
  { title: 'Welcome to Our Blog', content: 'This is the first default blog.' },
  { title: 'Introduction to Our Platform', content: 'This is the second default blog.' }
];
app.use('/', indexRoutes);

// Insert default blogs into the database on startup
// Blog.insertMany(defaultBlogs);
//, (err) => {
//    if (err) console.log('Error inserting default blogs:', err);
//}

// Routes


// Start the server
const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
