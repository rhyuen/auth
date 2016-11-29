var path = require("path");


module.exports = function(app, passport){

  app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "public/views/index.html"));
  });

  app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname, "public/views/login.html"));
  });

  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }));

  app.get("/signup", function(req, res){
    res.sendFile(path.join(__dirname, "public/views/signup.html"));
  });

  app.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup"
  }));

  app.get("/profile", isLoggedIn, function(req, res){
    res.render("userprofile", {
      user: req.user
    });
  });

  app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
   });

   app.get("/auth/twitter", passport.authenticate("twitter"));
   app.get("/auth/twitter/callback", passport.authenticate("twitter", {
     successRedirect: "/profile",
     failureRedirect: "/"
   }));

   app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));
   app.get("/auth/google/callback", passport.authenticate("google", {
     successRedirect: "/profile",
     failureRedirect: "/"
   }));

   //AUTHORIZE
   app.get("/connect/local", function(req, res){
     //send connect local file
     res.sendFile(path.join(__dirname, "public/views/connect.html"));
   });
   app.post("/connect/local", passport.authenticate("local-signup", {
     successRedirect: "/profile",
     failureRedirect: "/connect/local"
   }));

   app.get("/connect/twitter", passport.authorize("twitter", {scope: "email"}));
   app.get("/connect/twitter/callback", passport.authorize("twitter", {
     successRedirect: "/profile",
     failureRedirect: "/"
   }));

   app.get("/connect/google", passport.authorize("google", {scope: ["profile","email"]}));
   app.get("connect/google/callback", passport.authorize("google", {
     successRedirect: "/profile",
     failureRedirect: "/"
   }));

   app.get("/unlink/local", function(req, res){
     var user = req.user;
     user.local.email = undefined;
     user.local.password =undefined;
     user.save(function(err){
       if(err){
         console.log(err);
          throw err;
       }else{
         res.redirect("/profile");
       }
     });
   });

   app.get("/unlink/twitter", function(req, res){
     var user = req.user;
     user.twitter.token = undefined;
     user.save(function(err){
       if(err){
         console.log(err);
         throw err;
       }else{
          res.redirect("/profile");
       }
     });
   });

   app.get("/unlink/google", function(req, res){
     var user = req.user;
     user.google.token = undefined;
     user.save(function(err){
       if(err){
         console.log(err);
         throw err;
       }else{
          res.redirect("/profile");
       }
     });
   });
};

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();
  res.redirect("/");
}
