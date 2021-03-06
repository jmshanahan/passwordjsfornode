module.exports = function (app, passport){
  app.get('/', (req,res) =>{
    res.render('index.ejs');
  });
  //login
  app.get('/login',(req, res) => {
      res.render('login.ejs',{message: req.flash('loginMessage')});
  });

  app.post('/login',passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // signup
  app.get('/signup', (req, res) => {
    res.render('signup.ejs',{message: req.flash('signupMessage')});
  });

  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/profile', //redirect to the secure profile section
    failureRedirect: '/signup',
    failureFlash: true // allow flash messages
  }));
  // profile
  // We will want this to be protected so you have to be logged in to visit
  // we will use middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req,res) => {
    res.render('profile.ejs',{
      user: req.user
    });
  });

  // logout
  app.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
  });

  //Twitter routes
  //route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));


  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect:'/'
  }));
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
  return next();
  // if user is not authenticated redirected to homp page
  res.redirect('/');
}
