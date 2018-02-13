const LocalStrategy = require("passport-local").Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require("../app/models/user");
const configAuth = require("./auth");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Local signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          
          User.findOne({ "local.email": email }, function(err, user) {
            if (err) return done(err);
            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken")
              );
            } else {
              let newUser = new User();
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);
              newUser.save(function(err) {
                if (err) throw err;
                return done(null,newUser);
              });
            }
          });
        });
      }
    )
  );
  //local login
  passport.use('local-login', new LocalStrategy({
      //by default, local strategy uses username and password, we will override with email
      usernameField:'email',
      passwordField: 'password',
      passReqToCallback: true
    }, function(req,email,password,done){
      //Example left out process.nextTick but in example on Nodejs blueprints packt it is in
        process.nextTick(function(){
          User.findOne({'local.email': email}, function(err, user){
            if (err)
              return done(err);
            if(!user)
              return done(null, false, req.flash('loginMessage', 'No user found'));
            if(!user.validPassword(password))
              return done(null, false, req.flash('loginMessage', 'Oops ! wrong password'));
            return done(null, user);
          });
        }
      );
  }));

  // Twitter
  passport.use(new TwitterStrategy({
    consumerKey : configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
  }, function(token, tokenSecret,profile, done){
    //make this code asynchromous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function(){
      User.findOne({'twitter.id': profile.id}, function(err,user){
          if(err)
            return done(err);
          if(user){
            return done(null, user);
          }else {
            var newUser = new User();
            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.username = profile.username;
            newUser.twitter.displayName = profile.displayName;
            newUser.save(function(err){
              if (err)
                throw err;
              return done(null, newUser);
            });


          }
      });
    });
    }));
    

};
