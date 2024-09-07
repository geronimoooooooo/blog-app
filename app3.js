require('dotenv').config();
const express = require('express');
const fs         = require('fs');
const path       =  require('path')
const https      = require('https');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');
const User = require('./models/User');
const app = express()

const PORT = process.env.PORT 
const mongoString = process.env.MONGO_URL 
const host = process.env.HOST
const portHTTPS = process.env.PORTHTTPS || 443

mongoose.connect(mongoString);
const db = mongoose.connection;

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true, //sometimes false
  store: new MongoStore({ mongoUrl: db.client.s.url }) //or mongoUrl: mongoString
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js to use the User model
passport.use(User.createStrategy()); //new
//passport.use(new LocalStrategy(User.authenticate())); //old
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use('/', indexRoutes);


//#region WEBSERVER
//set NODE_OPTIONS=--openssl-legacy-provider in cmd in VS;read magic wiki
if(host=='vm04'){
    const credentials = {
      pfx: fs.readFileSync(path.join(__dirname,'sslcert', 'STAR_xx_at.pfx'))
    };     
    const httpsServer = https.createServer(credentials, app);
    
    // const port = process.env.PORT || 3000
    // app.listen(port, ()=>{
    //   console.log(`browse this url: localhost:${port}`);  
    // });
    
    //443 used: check tomcat http://localhost:8080/ 
    httpsServer.listen(portHTTPS, (err) => {
      if(err){
        console.log("Error: ", err);
        console.log(new Date().toISOString()+` https server could not start on ${host} port: ${portHTTPS}`);
      }else{
        console.log(new Date().toISOString()+` https server running on ${host} port: ${portHTTPS}`);
        console.log(new Date().toISOString()+` call: https://ispacevm04.researchstudio.at/main`);
      }
    });
  } else{
    const portHTTPS = process.env.PORTHTTPS || 443
    app.listen(portHTTPS, (err) => {
      if(err){
        console.log("Error: ", err);
        console.log(new Date().toISOString()+` https server on host ${host} could not start on port: ${portHTTPS}`);
      }else{
        console.log(new Date().toISOString()+` https server running on host ${host} port: ${portHTTPS}`);
        console.log(new Date().toISOString()+` call: localhost:443 in Mozilla`);
      }
    });  
  }
//#endregion
