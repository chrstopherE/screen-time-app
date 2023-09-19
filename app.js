require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000; // port is changeable
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/user');

//const MongoDBStore = require("connect-mongo")(session);

const { isLoggedIn } = require('./middleware'); //add to home route later

// requires screentime model
//const Screentime = require('./models/screentime.js');

// ejs engine
app.engine('ejs', ejsMate)

// sets up view to home.ejs file
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// const dbUrl = process.env.DB_URL
// connect to mongoDB
const uri = 'mongodb+srv://stmsadmin:stmsadmin@stmsdb.zdhsc63.mongodb.net/stmsDB?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
// logic to check if database is connected
.then((result) => console.log('Connected to Database'))
.catch((err) => console.log(err))

// setup public directory for other stuff
app.use(express.static('public'))

// middleware for parsing req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// prevents SQL and non-SQL injections for security purposes.
app.use(mongoSanitize());

// const store = new MongoDBStore({
//   url: uri,
//   secret: 'this is a secret',
//   touchAfter: 24 * 60 * 60 // 24 hours
// });

// store.on("error", function (e) {
//   console.log("SESSION STORE ERROR", e)
// })

// handles session request for the app if needed??
const sessionConfig = {
  //store,
  name: 'session',
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))

// flashes message for the user if needed.
app.use(flash()); // WHY WON't YOU SHOW???

app.use(passport.initialize()); // initializes passport
app.use(passport.session()); // middleware for persistent login session
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); // stores user in the session
passport.deserializeUser(User.deserializeUser()); // unstores user in the session

app.use((req, res, next) => {
  //console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/fakeUser', async (req, res) => {
  const user = new User({email: 'espeachristopher@gmail.com', username: 'toph'});
  const newUser = await User.register(user, 'toph12345');
  res.send(newUser);
})

app.use('/', userRoutes);

// setup route
app.get('/', (req, res) => {
  res.render('landing');
})

// setup route
app.get('/home', (req, res) => {
  res.render('home');
})

// Error handler
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if(!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render('error', { err });
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
