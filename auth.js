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
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true //checks if user logged in or not
  }, function(req, token, tokenSecret, profile, done){
    process.nextTick(function(){
      if(!req.user){
        User.findOne({"twitter.id": profile.id}, function(err, user){
          if(err){
            console.log(err);
            return done(err);
          }if(user){
            //UNLIKED CASE, WHEN ID PRESENT BUT TOKEN has been DELETED
            if(!user.twitter.token){
              user.twitter.token = token;
              user.twitter.displayName = profile.displayName;
              user.twitter.username = profile.username;

              user.save(function(err){
                if(err){
                  console.log(err);
                  throw err;
                }else{
                  return done(null, user);
                }
              });
            }
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
      //ALREADY LOGGED IN CASE
      //1) User Exists
      //2) Pull out of Session, Link ACCT
      }else{
        var user = req.user;
        user.twitter.id = profile.id;
        user.twitter.token = token;
        user.twitter.username = profile.username;
        user.twitter.displayname = profile.displayName;

        user.save(function(err){
          if(err){
            console.log(err);
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));

  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done){
    process.nextTick(function(){
      if(!req.user){
        User.findOne({"google.id": profile.id}, function(err, user){
          if(err)
            return done(err);
          if(user){
            if(!user.google.token){
              user.google.token = token;
              user.google.name = profile.displayName;
              user.google.email = profile.emails[0].value;
              user.save(function(err){
                if(err)
                  throw err;
                return done(null, user);
              });
            }return done(null, user);
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
      }else{
        var user = req.user;
        user.google.id = profile.id;
        user.google.token = token;
        user.google.name = profile.displayName;
        user.google.email = profile.emails[0].value;

        user.save(function(err){
          if(err){
            throw err;
          }
          return done(null, user);
        });
      }

    });
  }));
};
