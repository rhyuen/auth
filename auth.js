var LocalStrategy = require("passport-local").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var User = require("./models/user.js");
var config = require("./config.js");

module.exports = function(passport){
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      if(err){
        console.log(err);
      }
      done(err, user);
    });
  });

  passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({"local.email": email}, function(err, user){
        if(err)
          return done(err);
        if(user){
          return done(null, false);
        }else{
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err){
            if(err){
              console.log(err);
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, function(req, email, password, done){
    User.findOne({"local.email": email}, function(err, user){
      if(err){
        console.log(err)
        return done(err);
      }
      if(!user){
        return done(null, false);
      }
      if(!user.validPassword(password)){
        return done(null, false);
      }
      return done(null, user);
    });
  }));

  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  }, function(token, tokenSecret, profile, done){
    process.nextTick(function(){
      User.findOne({"twitter.id": profile.id}, function(err, user){
        if(err){
          console.log(err);
          return done(err);
        }if(user){
          return done(null, user);
        }else{
          var newUser = new User();
          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;

          newUser.save(function(err){
            if(err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  }, function(token, refreshToken, profile, done){
    process.nextTick(function(){
      User.findOne({"google.id": profile.id}, function(err, user){
        if(err)
          return done(err);
        if(user){
          return done(null, user);
        }else{
          var newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;

          newUser.save(function(err){
            if(err){
              console.log(err);
              throw err;
            }else{
              return done(null, newUser);
            }

          });
        }
      });
    });
  }));
};
