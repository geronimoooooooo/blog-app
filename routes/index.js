const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Blog = require('../models/Blog');

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Home Route
router.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.render('home', { blogs: blogs });
});

// Register Routes
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username, age: req.body.age });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profile');
    });
  });
});

// Login Routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

// Logout Route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Profile Route
router.get('/profile', isLoggedIn, async (req, res) => {
  const userBlogs = await Blog.find({ author: req.user._id });
  res.render('profile', { user: req.user, blogs: userBlogs });
});

// Create New Blog
router.post('/blogs', isLoggedIn, async (req, res) => {
  const newBlog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
  });
  await newBlog.save();
  res.redirect('/profile');
});

// Delete Blog
router.post('/blogs/:id/delete', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.redirect('/profile');
});

module.exports = router;
