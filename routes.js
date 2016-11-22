var path = require("path");


module.exports = function(app, passport){

  app.get("/", function(req, res){
    res.sendfile(path.join(__dirname, "public/views/index.html"));
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
    res.sendFile(path.join(__dirname, "public/views/profile.html"));
  });

  app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
   });
};

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();
  res.redirect("/");
}
