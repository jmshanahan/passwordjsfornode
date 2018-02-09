const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const password = require('passport')
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database');

// configuration section
mongoose.connect(configDB.url,(err, db) => {
  if(err){
      return console.log('Unable to connect to the MongoDB server');
  }
  console.log('Connected to MongoDB server');
});
// Setup express application
app.use(morgan('dev')); //log every request out to the console
app.use(cookieParser()); // read cookies. Needed for auth
app.use(bodyParser.urlencoded({extended:true}));   // get information from html forms

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //setup the ejs for templating

// Config password model
app.use(session({secret: 'tbWDUe53uBegqRGD2SD3dae1Z8aoKq3k'}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); // use connect flash for flash messages stored in session
// routes
require('./routes');

app.listen(port,() => {
  console.log(`The magic happens on ${port}`);
});


