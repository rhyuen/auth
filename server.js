var express = require("express");
var passport = require("passport");
var mongoose = require("mongoose");
var morgan = require("morgan");
var flash = require("connect-flash");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var config = require("./config.js");
var session = require("express-session");
var exphbs = require("express-handlebars");
var passport = require("passport");


mongoose.connect(config.db, function(err){
  if(err)
    console.log("[%s] ERROR: %s", new Date().toLocaleString(), err);
  else{
    console.log("[%s] DB CONN Attempted.", new Date().toLocaleString());
  }
});

require("./auth.js")(passport);

var app = express();


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.set("PORT", process.env.PORT || 8909);
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public/views"));
app.engine(".hbs", exphbs({
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "public/layouts"),
  partialsDir: path.join(__dirname, "public/partials"),
  extname: ".hbs"
}));
app.set("view engine", ".hbs");
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require("./routes.js")(app, passport);

app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status(err.status||500);
  res.render("error", {
    message: err.mesage,
    error: err
  });
  //res.send("error");
});

app.listen(app.get("PORT"), function(){
  console.log("Listening on PORT: %s", app.get("PORT"));
});
