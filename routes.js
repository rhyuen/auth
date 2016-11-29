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
};

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();
  res.redirect("/");
}
